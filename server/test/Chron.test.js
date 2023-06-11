const { before } = require('node:test');
const ListaSessioni = require('../src/components/chron/Chron.js');
const GestoreDB = require('../src/components/gestoreDB/gestoreDB.js');

jest.mock('../src/components/gestoreDB/gestoreDB'); // Mocking the GestoreDB module

describe('ListaSessioni', () => {
  let listaSessioni;

  beforeEach(() => {
    listaSessioni = new ListaSessioni('user123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('leggiStorico', () => {
    it('should retrieve session data for a the current week', async () => {

      const mockSessions = [
        { data: new Date('2023-06-01'), minuti: 60 },
        { data: new Date('2023-06-02'), minuti: 45 },
        { data: new Date('2023-06-03'), minuti: 30 },
      ];

      GestoreDB.leggiStorico.mockResolvedValue(mockSessions); 

      //conto quante volte clicco la freccia per visualizzare la data
      let oggi = new Date();
      let inizioSettCorr = new Date(oggi.setDate(oggi.getDate() - oggi.getDay() + 1));
      inizioSettCorr.setHours(2, 0, 0, 0); //fuso orario di 2 ore
      
      async function numero_click(){
        let numero_click = 0;
        while (inizioSettCorr.toISOString().slice(0, 10) !== '2023-05-29' && inizioSettCorr.getFullYear() === 2023) {
          inizioSettCorr.setDate(inizioSettCorr.getDate() - 7);
          numero_click--;
        }
        return numero_click;
      }

      let click = await numero_click();
      const result = await listaSessioni.leggiStorico(click, "false");

      expect(result.sessioni).toEqual([
          { data: '2023-05-29', minuti: 0 },
          { data: '2023-05-30', minuti: 0 },
          { data: '2023-05-31', minuti: 0 },
          { data: '2023-06-01', minuti: 60 },
          { data: '2023-06-02', minuti: 45 },
          { data: '2023-06-03', minuti: 30 },
          { data: '2023-06-04', minuti: 0 },
      ]
    );
    });

    it('should retrieve session data for a the current month', async () => {
   
      const mockSessions = [
        { data: new Date('2023-06-01'), minuti: 60 },
        { data: new Date('2023-06-02'), minuti: 45 },
        { data: new Date('2023-06-03'), minuti: 30 },
      ];

      GestoreDB.leggiStorico.mockResolvedValue(mockSessions); 

      //conto quante volte clicco la freccia per visualizzare il mese
      let oggi = new Date();
  
      const result = await listaSessioni.leggiStorico(5-oggi.getMonth(), "true");
      //controllo primo e ultimo del mese
      expect(result.sessioni[0]).toEqual({ data: '2023-06-01', minuti: 60 });
      expect(result.sessioni[result.sessioni.length - 1]).toEqual({ data: '2023-06-30', minuti: 0 });

    });


    it('should throw an error if the interval is invalid', async () => {
      await expect(listaSessioni.leggiStorico('invalid', 'true')).rejects.toThrow('Intervallo non valido');
      await expect(listaSessioni.leggiStorico(10, 'invalid')).rejects.toThrow('Intervallo non valido');
    });
  });

  describe('calolaTempoSessione', () => {
    it('should calculate the total time of all sessions', async () => {
      listaSessioni.ListaSessioni = [
        { data: '2023-06-01', minuti: 60 },
        { data: '2023-06-02', minuti: 45 },
        { data: '2023-06-03', minuti: 30 },
      ];

      const result = await listaSessioni.calolaTempoSessione();

      expect(result).toBe(135);
    });
  });

  describe('calcolaMediaSessione', () => {
    it('should calculate the average time of sessions', async () => {
      listaSessioni.ListaSessioni = [
        { data: '2023-06-01', minuti: 60 },
        { data: '2023-06-02', minuti: 45 },
        { data: '2023-06-03', minuti: 30 },
      ];

      const result = await listaSessioni.calcolaMediaSessione();

      expect(result).toBe(45);
    });
  });

  describe('calcolaTassoSettimana', () => {
    //clear mock
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      listaSessioni = new ListaSessioni('user123');
    });
    
    it('should calculate the rate for a weekly interval', async () => {

      const mockSessions = [
        { data: new Date('2023-06-01'), minuti: 60 },
        { data: new Date('2023-06-02'), minuti: 45 },
        { data: new Date('2023-06-03'), minuti: 30 },
      ];

      GestoreDB.leggiStorico.mockResolvedValue(mockSessions);

      const result = await listaSessioni.calcolaTassoSettimana(new Date('2023-06-05'), 100);

      expect(GestoreDB.leggiStorico).toHaveBeenCalledWith(
        'user123',
        new Date('2023-05-29T00:00:00.000Z'),
        new Date('2023-06-04T21:59:59.000Z')
      );
      expect(result).toBe((100-135)/135*100); // You can provide the expected value based on your calculation logic
    });
  });


  describe('calcolaTassoMese', () => {
    it('should calculate the rate for a monthly interval', async () => {
      const mockSessions = [
        { data: new Date('2023-05-01'), minuti: 100 },
        { data: new Date('2023-05-15'), minuti: 150 },
        { data: new Date('2023-05-31'), minuti: 200 },
      ];

      GestoreDB.leggiStorico.mockResolvedValue(mockSessions);

      const result = await listaSessioni.calcolaTassoMese(new Date('2023-06-01'), 500);

      expect(GestoreDB.leggiStorico).toHaveBeenCalledWith(
        'user123',
        new Date('2023-05-01T00:00:00.000Z'),
        new Date('2023-05-31T21:59:59.000Z')
      );
      expect(result).toBe((500-450)/450*100); // You can provide the expected value based on your calculation logic
    });
  });
});
