const  GestoreDB  = require('../gestoreDB/gestoreDB');
const gestoreEmail = require("../gestoreEmail/gestoreEmail");

const htmlBody = require('fs').readFileSync(require('path').join(__dirname, '..', 'gestoreEmail', 'taskCompletata.html'), 'utf8');

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
        if(this.ID_gruppo != null && this.contrassegna == true) {
            const dataLeader = await GestoreDB.getDataFromID(this.ID_leader);
            const dataUtente = await GestoreDB.getDataFromID(this.ID_utente);

            const formattedHtmlBody = htmlBody
                .replace('{{taskName}}', this.nome)
                .replace('{{deadline}}', this.dataScadenza)
                .replace('{{groupName}}', this.nomeGruppo)
                .replace('{{memberName}}', dataUtente.username);
            gestoreEmail([dataLeader.email], 'Notifica completamento task', formattedHtmlBody);
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