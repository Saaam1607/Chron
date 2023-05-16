mongoose = require("../../config/db");
const SessioneModel = require("../../models/Sessione");

let Schema = new mongoose.Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String}
});

// NOTA: "user" è il nome della collection al singolare (quindi "users")
let Credenziali = mongoose.model('user', Schema); 


class GestoreDB {

    static registra(username, email, password) {
        return new Promise((resolve, reject) => {
            // controllo se l'utente esiste già
            if (!this.login(email, password)) {
                console.log("utente già esistente")
                // l'utente esiste già
            } else{
                const user = new Credenziali({
                    username: username,
                    email: email,
                    password: password
                });
                user.save({ username: username, email: email, password: password })
                    .then((result) => {
                        if (result) {
                        resolve(true); // Resolve with true if the entry exists
                        } else {
                        resolve(false); // Resolve with false if the entry does not exist
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(error); // Reject with the error if there was an error
                    });
            }
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
                    console.error(error);
                    reject(error); // Reject with the error if there was an error
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
                    return sessioneDB.save();
                } else {
                    const nuovaSessione = new SessioneModel({
                        ID_utente: sessione.ID_utente,
                        data: new Date(Date.UTC(sessione.data.anno, sessione.data.mese - 1, sessione.data.giorno)),
                        minuti: sessione.tempo.ore * 60 + sessione.tempo.minuti,
                    });
                    return nuovaSessione.save();
                }
            }).then(() => {
                resolve();
            }).catch(error => {
                console.error(error);
                reject({ message: `Non è possibile effettuare il salvataggio della sessione. Messaggio errore: ${error}` });
            });
        });
    }

}
    
    

module.exports = GestoreDB;