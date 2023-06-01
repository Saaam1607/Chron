const  GestoreDB  = require('../gestoreDB/gestoreDB');

class Task {
    constructor(ID_utente, nome, dataScadenza) {
        this._id = null;
        this.ID_utente = ID_utente
        this.nome = nome;
        this.dataScadenza = dataScadenza;
        this.contrassegna = false;
        this.nomeGruppo = null;
    }

    async crea() {        
        return await GestoreDB.aggiornaTask(null, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna, this.nomeGruppo, false);
    }

    async contrassegnaTask() {
        this.contrassegna = !this.contrassegna;
        return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.nomeGruppo, false);
    }

    async elimina() {
        if (this.contrassegna) {
            return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.nomeGruppo, true);
        } else {
            throw new Error("Impossibile eliminare una task non contrassegnata");
        }
    }
}

module.exports = Task;