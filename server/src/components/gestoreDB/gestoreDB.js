//mongoose = require("../../config/db");
const mongoose = require('mongoose');

const SessioneModel = require("../../models/Sessione");
const Credenziali = require("../../models/UserSchema");
const Gruppo = require("../../models/GruppoSchema");
const TaskModel = require("../../models/Task");
const SalaStudio = require("../../models/SalaStudioSchema");
const TokenModel = require("../../models/TokenSchema");


class GestoreDB {

    static leggiSaleStudio() {
        return new Promise((resolve, reject) => {
            SalaStudio.find()
                .then(listaSaleStudio => {
                    resolve(listaSaleStudio);
                })
                    .catch(error => {
                        reject({ message: `Errore durante la lettura dei gruppi: ${error}` });
                    });
        });
    }

    static leggiSaleStudioPerNome(nome) {
        return new Promise((resolve, reject) => {
            let result = [];
        
            SalaStudio.find({ name: { $regex: new RegExp(nome, 'i') } })
                .then(listaSaleStudio => {
                    listaSaleStudio.forEach(salaStudio => {
                        result.push(salaStudio);
                    });
                    resolve(result);
                })
                        .catch(error => {
                            reject({ message: `Errore durante la lettura dei gruppi: ${error}` });
                        });
            });
        }

        static leggiSaleStudioPerIndirizzo(indirizzo) {
            return new Promise((resolve, reject) => {
                let result = [];
            
                SalaStudio.find({ address: { $regex: new RegExp(indirizzo, 'i') } })
                    .then(listaSaleStudio => {
                        listaSaleStudio.forEach(salaStudio => {
                            result.push(salaStudio);
                        });
                        resolve(result);
                    })
                            .catch(error => {
                                reject({ message: `Errore durante la lettura dei gruppi: ${error}` });
                            });
                });
            }

    static controllaEsistenzaEmail(email) {
        return Credenziali.countDocuments({ email: email })
            .then((result) => {
                if (result) {
                    return true;
                } else {
                    return false;
                }
            })
    }

    static registra(username, email, password) {
        return new Promise((resolve, reject) => {
            const user = new Credenziali({
                username: username,
                email: email,
                password: password,
                _id: new mongoose.Types.ObjectId()
            });
            user.save({ username: username, email: email, password: password })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject({message: "Errore durante la registrazione", errore: error}); // Reject with the error if there was an error
                });
        });
    }

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
                    reject(error);
                });
        });
    }

    static aggiornaTask(_id, ID_utente, nome, dataScadenza, contrassegna, ID_gruppo, rimuovi) {
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
                        _id: _id ? _id : new mongoose.Types.ObjectId(),
                        ID_utente: ID_utente,
                        nome: nome,
                        dataScadenza: dataScadenza,
                        ID_gruppo: ID_gruppo,
                        contrassegna: contrassegna,
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

    static checkIfTaskExist(_id) {
        return new Promise((resolve, reject) => {
          TaskModel.countDocuments({ _id: _id })
            .then((result) => {
              if (result) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        });
    }
    
    static checkIfTokenExist(token) {
        return new Promise((resolve, reject) => {
            TokenModel.countDocuments({ token: token })
                .then((result) => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    static salvaToken(token) {
        return new Promise((resolve, reject) => {
            const nuovoToken = new TokenModel({
                _id: new mongoose.Types.ObjectId(),
                token: token,
            });
            nuovoToken.save()
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject({ message: `Non è possibile effettuare il salvataggio del token. Messaggio errore: ${error}` });
                });
        });
    }

    static deleteToken(token) {
        return new Promise((resolve, reject) => {
            TokenModel.deleteOne({ token: token })
                .then(() => {
                    resolve(true);
                })
                .catch(error => {
                    reject({ message: `Non è possibile effettuare la rimozione del token. Messaggio errore: ${error}` });
                });
        });     
    }
      
    static ottieniGruppiMembro(membro_id) {
        const id = new mongoose.Types.ObjectId(membro_id)
        return new Promise((resolve, reject) => {
            Gruppo.find({ members_id: { $in: [id] } })
                .then(listaGruppi => {
                    resolve(listaGruppi);
                })
                    .catch(error => {
                        reject({ message: `Errore durante la lettura dei gruppi: ${error}` });
                    });
        });
    }

    static ottieniGruppiLeader(leader_id) {
        const id = new mongoose.Types.ObjectId(leader_id)
        return new Promise((resolve, reject) => {
            Gruppo.find({ leader_id: { $in: [id] } })
                .then(listaGruppi => {
                    resolve(listaGruppi);
                })
                    .catch(error => {
                        reject({ message: `Errore durante la lettura dei gruppi: ${error}` });
                    });
        });
    }

    static creaGruppo(nome, leader_id) {

        return new Promise((resolve, reject) => {
            
            const nuvoGruppo = new Gruppo({
                
                _id: new mongoose.Types.ObjectId(),
                name: nome,
                leader_id: leader_id,
                members_id: []

            });

            nuvoGruppo.save()
                .then(() => {
                    resolve({ stato: 201 });
                })
                    .catch(error => {
                        reject({ message: `Non è possibile effettuare il salvataggio della sessione. Messaggio errore: ${error}` });
                    });
        })
    }

    static async checkIfObjectId(id) {
        try {
            id = new mongoose.Types.ObjectId(id);
        } catch (error) {
            return false;
        }
        return true;
    }

    static async controllaEsistenzaUtente(id) {
        try {
            const utente = await Credenziali.findOne({ _id: new mongoose.Types.ObjectId(id) });
            if (utente) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    static async controllaMembroInGruppo(id_utente, id_gruppo) {
        try {
            const gruppo = await Gruppo.findOne({ _id: new mongoose.Types.ObjectId(id_gruppo) });
            if (gruppo) {
                if (gruppo.members_id.includes(id_utente)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    static async controllaEsistenzaGruppo(codice) {
        try {
            const gruppo = await Gruppo.findOne({ _id: new mongoose.Types.ObjectId(codice) });
            if (gruppo) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    static uniscitiGruppo(codice, id_utente) {
        try {

            return new Promise((resolve, reject) => {

                codice = new mongoose.Types.ObjectId(codice);
                id_utente = new mongoose.Types.ObjectId(id_utente);

                Gruppo.findById(codice)
                .then(gruppo => {
                    
                    if (gruppo) {

                        if (gruppo.leader_id.equals(id_utente)) {
                            reject({ stato: 409 });
                        } else if (gruppo.members_id.includes(id_utente)) {
                            reject({ stato: 409 })
                        } else {
                            gruppo.members_id.push(id_utente);
                            gruppo.save()
                                .then(() => {
                                    resolve({ stato: 200 }); 
                                    return;
                                });
                        }

                    } else {
                        reject({ stato: 404 })
                    }
                })
                    .catch(error => {
                        reject({ stato: 500, message: `${error}` });
                        return;
                    });

            });

        } catch (error) {
            console.log(error)
        }

    }

    static async getLeaderIDfromGroupID(codice) {
        try {
            const gruppo = await Gruppo.findById(new mongoose.Types.ObjectId(codice))
            if (gruppo) {
                return gruppo.leader_id;
            } else {
                throw new Error("Errore durante la lettura del leader del gruppo");
            }
        } catch (error) {
            throw error;
        }
    }

    static async rimuoviMembroDaGruppo(membro_id, codice) {
        try {
            const gruppo = await Gruppo.findById(new mongoose.Types.ObjectId(codice))
            if (gruppo) {
                const index = gruppo.members_id.indexOf(new mongoose.Types.ObjectId(membro_id));
                if (index > -1) {
                    gruppo.members_id.splice(index, 1);
                    await gruppo.save();
                } else {
                    throw new Error("L'utente non è membro del gruppo");
                }
            } else {
                throw new Error("Il gruppo non esiste");
            }
        } catch (error) {
            throw error;
        }
    }

    static async eliminaGruppo(codice) {
        try {
            const gruppo = await Gruppo.findById(codice)
            if (gruppo) {
                await Gruppo.deleteOne({ _id: codice });
            } else {
                throw new Error("Il gruppo non esiste. Eliminazione non effettuata.");
            }
        } catch (error) {
            console.log(error)
        }
    }

    

    static ottieniGruppoByID(ID_gruppo) {
        return new Promise((resolve, reject) => {
            Gruppo.find({ _id: ID_gruppo })
                .then(gruppo => {
                    resolve(gruppo);
                })
                    .catch(error => {
                        reject({ message: `Errore durante la lettura del gruppo: ${error}` });
                    });
        });
    }

    static getDataFromEmail(email) {
        return new Promise((resolve, reject) => {
            Credenziali.findOne({ email: email })
                .then((result) => {
                    if (result) {
                        resolve({success: true, _id: result._id, username: result.username, email: result.email}); // Resolve with true if the entry exists
                    } else {
                        resolve(null); // no result
                    }
                })
                .catch((error) => {
                    reject({message: "Errore nella ricerca dell'email", errore: error});
                });
        });
    }

    static aggiornaPassword(ID_utente, nuova_password) {
        return new Promise((resolve, reject) => {
          Credenziali.updateOne({ _id: new mongoose.Types.ObjectId(ID_utente) }, { password: nuova_password })
            .then((result) => {
              if (result) {
                resolve({ success: true, _id: result._id });
              } else {
                reject({ message: "Utente non trovato" });
              }
            })
            .catch((error) => {
              reject({ message: "Errore nella ricerca dell'utente", error });
            });
        });
    }




    // MODIFICA DEI DATI DEL PROFILO
    static async controllaCredenziali(utente_id, password) {
        utente_id = new mongoose.Types.ObjectId(utente_id)

        const esito = await Credenziali.countDocuments({ _id: utente_id, password: password })
        if (esito){
            return true;
        } else {
            return false;
        }
    }

    static async modificaUsername(utente_id, username) {
        await Credenziali.updateOne({ _id: new mongoose.Types.ObjectId(utente_id) }, {
            username: username
        });
    }

    static async modificaEmail(utente_id, email) {
        await Credenziali.updateOne({ _id: new mongoose.Types.ObjectId(utente_id) }, {
            email: email
        });
    }

    static async modificaPassword(utente_id, password) {
        await Credenziali.updateOne({ _id: new mongoose.Types.ObjectId(utente_id) }, {
            password: password
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