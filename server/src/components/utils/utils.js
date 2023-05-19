class Data {
    constructor(giorno, mese, anno) {
      const dataCorrente = new Date();
      this.giorno = giorno || dataCorrente.getDate();
      this.mese = mese || dataCorrente.getMonth() + 1;
      this.anno = anno || dataCorrente.getFullYear();
    }
  
    inizializzaDataCorrente(giorno, mese, anno) {
      this.giorno = giorno;
      this.mese = mese;
      this.anno = anno;
    }
  }
  
  class Tempo {
    constructor() {
      this.ore = 0;
      this.minuti = 0;
    }
  
    aggiungiTempo(minuti) {
      const totaleMinuti = this.minuti + minuti;
      this.ore += Math.floor(totaleMinuti / 60);
      this.minuti = totaleMinuti % 60;
    }
  }
  
  class Sessione {
    constructor(data, tempo, ID_utente) {
      this.data = data;
      this.tempo = tempo;
      this.ID_utente = ID_utente;
    }
  }
  
  module.exports = {
    Data,
    Tempo,
    Sessione
  };