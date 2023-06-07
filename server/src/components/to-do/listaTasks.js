const Task = require('./task');
const  GestoreDB  = require('../gestoreDB/gestoreDB');

class ListaTasks {
  
  constructor(ID_utente) {
    this.ID_utente = ID_utente;
    this.tasks = [];
  }

  async leggiTasks() {
    try {
      // Svuota l'array delle tasks
      this.tasks.splice(0, this.tasks.length);
  
      // Leggi le tasks dal database
      const tasks = await GestoreDB.ottieniTasks(this.ID_utente);
  
      // Crea oggetti Task a partire dalle tasks lette dal database
      for (const task of tasks) {
        const nuovaTask = new Task(task.ID_utente, task.nome, task.dataScadenza);
        nuovaTask._id = task._id;
        nuovaTask.contrassegna = task.contrassegna;
        nuovaTask.ID_gruppo = task.ID_gruppo;
  
        if (task.ID_gruppo !== null) {
          const gruppo = await GestoreDB.ottieniGruppoByID(task.ID_gruppo);
          nuovaTask.nomeGruppo = gruppo[0].name;
          nuovaTask.ID_leader = gruppo[0].leader_id;
        }
  
        this.tasks.push(nuovaTask);
      }
  
    } catch (error) {
      console.error(`Errore durante la lettura delle tasks per l'utente ${this.ID_utente}: ${error}`);
      throw error;
    }
    return this.tasks;
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