// //fatto su modello listaTask
const  GestoreDB  = require('../gestoreDB/gestoreDB');

class ListaSessioni {
  constructor(ID_utente, data, minuti) {
    this.ID_utente = ID_utente;
    this.data = data;
    this.minuti = minuti;
    this.ListaSessioni = [];
  }

  async leggiStorico() {
    try {
      // svuota l'array delle sessioni
      this.ListaSessioni.splice(0, this.ListaSessioni.length);
      // leggi le sessioni dal database
      const Storico = await GestoreDB.leggiStorico(this.ID_utente);
  
      // crea oggetti Task a partire dalle tasks lette dal database
       Storico.forEach((sessione) => {
        const nuovaSessione = new ListaSessioni(sessione.ID_utente, sessione.data, sessione.minuti);
        // nuovaSessione._id = sessione._id;
        // nuovaSessione.contrassegna = sessione.contrassegna;
        // nuovaSessione.gruppoID = sessione.gruppoID;
        this.ListaSessioni.push(nuovaSessione);
      }); 
      return this.ListaSessioni;
    } catch (error) {
      // Gestisci eventuali errori
      console.error(`Errore durante la lettura delle tasks per l'utente ${this.ID_utente}: ${error}`);
      throw error;
    }
  }

}

module.exports = ListaSessioni;