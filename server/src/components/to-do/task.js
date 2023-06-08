const  GestoreDB  = require('../gestoreDB/gestoreDB');
const  GestoreEmail = require("../gestoreEmail/gestoreEmail");

class Task {

    constructor(ID_utente, nome, dataScadenza) {
        this._id = null;
        this.ID_utente = ID_utente;
        this.nome = nome;
        this.dataScadenza = dataScadenza;
        this.contrassegna = false;
        this.ID_gruppo = null;
        this.nomeGruppo = null;
        this.emailLeader = null;        
    }

    async crea() {
        return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna, this.ID_gruppo, false);
    }

    async contrassegnaTask() {
        this.contrassegna = !this.contrassegna;
        const result = await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.ID_gruppo, false);

        //if the task is completed and it belongs to a group, send an email to the group leader
        if(this.ID_gruppo != null && this.contrassegna == true) {
            const dataLeader = await GestoreDB.getDataFromID(this.ID_leader);
            const dataUtente = await GestoreDB.getDataFromID(this.ID_utente);

            await GestoreEmail.inviaEmailTaskCompletata([dataLeader.email], 'Notifica completamento task', this.nome, this.dataScadenza, this.nomeGruppo, dataUtente.username);
        }
        return result;
    }

    async elimina() {
        if (this.contrassegna) {
            return await GestoreDB.aggiornaTask(this._id, this.ID_utente, this.nome, this.dataScadenza, this.contrassegna,this.ID_gruppo, true, );
        } else {
            throw new Error("Impossibile eliminare una task non contrassegnata");
        }
    }
}

module.exports = Task;