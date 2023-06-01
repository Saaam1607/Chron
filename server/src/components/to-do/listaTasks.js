const Task = require('./task');
const  GestoreDB  = require('../gestoreDB/gestoreDB');

class ListaTasks {
  constructor(ID_utente) {
    this.ID_utente = ID_utente;
    this.tasks = [];
  }

  async leggiTasks() {
    try {
      // svuota l'array delle tasks
      this.tasks.splice(0, this.tasks.length);
      // leggi le tasks dal database
      const tasks = await GestoreDB.ottieniTasks(this.ID_utente);
      // crea oggetti Task a partire dalle tasks lette dal database
       tasks.forEach((task) => {
        const nuovaTask = new Task(task.ID_utente, task.nome, task.dataScadenza);
        nuovaTask._id = task._id;
        nuovaTask.contrassegna = task.contrassegna;
        nuovaTask.nomeGruppo = task.nomeGruppo;
        this.tasks.push(nuovaTask);
      }); 

      return this.tasks;
    } catch (error) {
      // Gestisci eventuali errori
      console.error(`Errore durante la lettura delle tasks per l'utente ${this.ID_utente}: ${error}`);
      throw error;
    }
  }

  ordinaPerNome() {
    this.tasks.sort((a, b) => a.nome.localeCompare(b.nome));
  }
  
  ordinaPerGruppo() {
    this.tasks.sort((a, b) => {
      if (a.nomeGruppo === null && b.nomeGruppo === null) {
        return 0;
      }
      if (a.nomeGruppo === null) {
        return 1;
      }
      if (b.nomeGruppo === null) {
        return -1;
      }
      return a.nomeGruppo.localeCompare(b.nomeGruppo);
    });
  }

  ordinaPerDataScadenza() {
    this.tasks.sort((a, b) => {
      if (a.dataScadenza === null && b.dataScadenza === null) {
        return 0;
      } else if (a.dataScadenza === null) {
        return 1;
      } else if (b.dataScadenza === null) {
        return -1;
      } else {
        return a.dataScadenza.getTime() - b.dataScadenza.getTime();
      }
    });
  }
}

module.exports = ListaTasks;