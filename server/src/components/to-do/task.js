const  GestoreDB  = require('../gestoreDB/gestoreDB');

class Task {
    constructor(ID_utente, nome, dataScadenza) {
        this._id = null;
        this.ID_utente = ID_utente
        this.nome = nome;
        this.dataScadenza = dataScadenza;
        this.contrassegna = false;
        this.gruppoID = null;
    }

    async crea() {        
        return await GestoreDB.aggiornaTask(null, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna, this.gruppoID, false);
    }

    async contrassegnaTask() {
        this.contrassegna = !this.contrassegna;
        return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.gruppoID, false);
    }

    async elimina() {
        if (this.contrassegna) {
            return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.gruppoID, true);
        } else {
            throw new Error("Impossibile eliminare una task non contrassegnata");
        }
    }
}

module.exports = Task;