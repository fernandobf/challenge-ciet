const formatDate = require('../js/app');

describe('Validar formato de data e hora', () => {
    it('Deve formatar para o padrão DD/MM/YYYY e HH:mm', () => {
        const result = formatDate('2019-11-10 09:00:00');
        expect(result).toBe('10/11/2019, às 09:00h');    
    });
})