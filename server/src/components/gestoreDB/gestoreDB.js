//mongoose = require("../../config/db");
const mongoose = require('mongoose');

const SessioneModel = require("../../models/Sessione");
const Credenziali = require("../../models/Schema");
const TaskModel = require("../../models/Task");


class GestoreDB {

    // REVISIONATA [ XXX ]
    static controllaEsistenzaEmail(email) {
        Credenziali.countDocuments({ email: email })
            .then((result) => {
                if (result) {
                    return true;
                } else {
                    return false;
                }
            })
    }

    // REVISIONATA [ XXX ]
    static registra(username, email, password) {
        return new Promise((resolve, reject) => {
            const user = new Credenziali({
                username: username,
                email: email,
                password: password,
                _id: new mongoose.Types.ObjectId()
            });
            user.save({ username: username, email: email, password: password })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject({message: "Errore durante la registrazione", errore: error}); // Reject with the error if there was an error
                });
        });
    }

    // REVISIONATA [ XXX ]
    static login(email, password) {
        return new Promise((resolve, reject) => {
            Credenziali.countDocuments({ email: email, password: password })
                .then((result) => {
                    if (result) {
                        resolve(true); // Resolve with true if the entry exists
                    } else {
                        resolve(false); // Resolve with false if the entry does not exist
                    }
                })
                .catch((error) => {
                    reject({message: "Errore durante l'autenticazione", errore: error}); // Reject with the error if there was an error
                });
        });
    }

    // REVISIONATA [ XXX ]
    static getIDfromEmail(email) {
        return new Promise((resolve, reject) => {
            Credenziali.findOne({ email: email })
                .then((result) => {
                    if (result) {
                        resolve(result._id); // Resolve with true if the entry exists
                    } else {
                        resolve(null); // no result
                    }
                })
                .catch((error) => {
                    reject({message: "Errore nella ricerca dell'ID", errore: error});
                });
        });
    }

    // REVISIONATA [ XXX ]
    static getDataFromID(id) {
        return new Promise((resolve, reject) => {
            Credenziali.findById(id)
                .then((result) => {
                    if (result) {
                        resolve({success: true, username: result.username, email: result.email}); // Resolve with true if the entry exists
                    } else {
                        resolve(null); // Resolve with false if the entry does not exist
                    }
                })
                .catch((error) => {
                    reject({message: "Errore durante la ricerca dati", errore: error}); // Reject with the error if there was an error
                });
        });
    }

    static salvaSessione(sessione) {
        return new Promise((resolve, reject) => {
            SessioneModel.findOne({
                ID_utente: sessione.ID_utente,
                data: new Date(Date.UTC(sessione.data.anno, sessione.data.mese - 1, sessione.data.giorno))
            }).then(sessioneDB => {
                if (sessioneDB) {
                    sessioneDB.minuti += sessione.tempo.ore * 60 + sessione.tempo.minuti;
                    sessioneDB.save().then(() => { resolve({ stato: 200 }); });
                } else {
                    const nuovaSessione = new SessioneModel({
                        _id: new mongoose.Types.ObjectId(),
                        ID_utente: sessione.ID_utente,
                        data: new Date(Date.UTC(sessione.data.anno, sessione.data.mese - 1, sessione.data.giorno)),
                        minuti: sessione.tempo.ore * 60 + sessione.tempo.minuti,
                    });
                    nuovaSessione.save().then(() => { resolve({ stato: 201 }); });
                }
            })
            .catch(error => {
                console.error(error);
                reject({ message: `Non è possibile effettuare il salvataggio della sessione. Messaggio errore: ${error}` });
            });
        });
    }

    static ottieniTasks(ID_utente) {
        return new Promise((resolve, reject) => {
        TaskModel.find({ ID_utente: ID_utente })
            .then(tasks => {
                resolve(tasks);
            })
            .catch(error => {
                console.error(`Errore durante la lettura delle tasks per l'utente ${ID_utente}: ${error}`);
                reject({ message: error });
            });
        });
    }

    static aggiornaTask(_id, ID_utente, nome, dataScadenza, contrassegna, gruppoID, rimuovi) {
        return new Promise((resolve, reject) => {
          let task;
          TaskModel.findOne({ _id: _id })
            .then((foundTask) => {
              task = foundTask;
                if (rimuovi) {
                    if (task) {
                        return TaskModel.deleteOne({ _id: _id });
                    } else {
                        throw new Error("La task non esiste. Rimozione non effettuata.");
                    }
                } else {
                    const nuovaTask = new TaskModel({
                        _id: new mongoose.Types.ObjectId(),
                        ID_utente: ID_utente,
                        nome: nome,
                        dataScadenza: dataScadenza,
                        gruppoID: gruppoID,
                        contrassegna: contrassegna
                    });
        
                    if (task) {
                    return TaskModel.updateOne({ _id: _id }, { $set: { contrassegna: contrassegna } }, { upsert: false })
                        .then(() => TaskModel.findOne({ _id: _id }));
                    } else {
                        return nuovaTask.save();
                    }
                }
            })
            .then((result) => {
                if (rimuovi && result.deletedCount > 0) {
                        resolve("La task è stata rimossa con successo.");
                } else if (!rimuovi && result) {
                        if (task) {
                            resolve(result); // Restituisci la task aggiornata
                        
                        } else {
                            resolve(result); // Restituisci la nuova task creata
    
                        }
                } else {
                        resolve("Nessuna operazione effettuata.");
                }
            })
            .catch((error) => {
                console.error(`Errore durante l'aggiornamento della task per l'utente ${ID_utente}: ${error}`);
                reject({ message: error });
            });
        });
      }

      static leggiStorico(ID_utente, startDate, endDate) {
        return new Promise((resolve, reject) =>{
        SessioneModel.find({ ID_utente: ID_utente, data : { $gte: startDate, $lte: endDate }}) 
            .sort({ data: 1 }) //ordered by date
            .then(dati => {
                resolve(dati);
            })
            .catch(error => {
                console.error(`Errore durante la lettura delle ore di studio per l'utente ${ID_utente}: ${error}`);
                reject({ message: error });
            });
        });
    }
}

    

module.exports = GestoreDB;