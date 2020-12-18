/**
 * Objeto de estado global da aplicação,
 */
const globalState = {
    jobsList: [],
    dateStart: '2019-11-10 09:00:00',
    dateEnd: '2019-11-11 12:00:00'
};

/**
 * Variáveis globais que mapeiam elementos HTML
 */
let result          = document.querySelector('#content');
let HTMLdateStart   = document.querySelector('#date-start');
let HTMLdateEnd     = document.querySelector('#date-end');
let spinner         = document.getElementById('spinner'); 

/**
 * Função principal da aplicação
 */
async function start() {
    HTMLdateStart.innerHTML = formatDate(globalState.dateStart);
    HTMLdateEnd.innerHTML   = formatDate(globalState.dateEnd);

    spinnerControl(false);
    getData();
    
    setInterval(function(){ 
        getData();
    }, 60000);    
}

/**
 * Métodos da aplicação
 */
const getData = async () =>{
    try{
        spinnerControl(true, "flex");
        const url = await fetch('api/jobs.js');
        const json = await url.json();
        globalState.jobsList = json.map(user => {
            const { ID, description, dateMax, estimate } = user;
            return{
                ID, description, dateMax, estimate
            }
        })
        onCheckDate();

        setTimeout(function(){ spinnerControl(false) }, 2000);
    }catch(error){
        console.error('Mensagem de erro:', error);
    }finally {
        console.log('Ok');
    }
}

const onCheckDate = () =>{
    dateStart   = new Date(globalState.dateStart);
    dateEnd     = new Date(globalState.dateEnd);

    var timeMax =  globalState.jobsList.filter(job => job.estimate <= 8);
    var timeRange =  timeMax.filter(job =>
        dateStart.getTime() <= new Date(job.dateMax).getTime() &&
        dateEnd.getTime() > new Date(job.dateMax).getTime());

        orderJobs(timeRange)
        renderUserList(timeRange);
}

function spinnerControl(state, display){
    if(state === true){
        spinner.style.display = display;
    }else{
        spinner.style.display = "none";
    }
}

function renderUserList(timeRange){
    let usersHTML = "<ul>";
    timeRange.forEach(job => {
        const userHTML = `
            <li>
                <h2>Identificação: ${job.ID}</h2>
                <p>Descrição: ${job.description}</p>
                <time datetime="${job.dateMax}">Data limite: ${formatDate(job.dateMax)}</time>
                <time>Estimativa: ${'0' + job.estimate + ' hora (s)'}</time>
            </li>
        `;
       
      usersHTML += userHTML;
    });
    usersHTML += '</ul>';

    result.innerHTML = usersHTML;
}

function orderJobs(arr){
    arr.sort(function(a, b) {
        let dateA = new Date(a.dateMax),
        dateB = new Date(b.dateMax);
        return dateA - dateB;
    });
}

function formatDate(dateTimeString) {
    const [date, time] = dateTimeString.split(' ');
    const [YYYY, MM, DD] = date.split('-');
    const [HH, mm] = time.split(':');
    return `${DD}/${MM}/${YYYY}, às ${HH}:${mm}h`;
}

start();

module.exports = formatDate