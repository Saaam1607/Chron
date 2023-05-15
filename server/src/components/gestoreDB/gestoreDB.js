mongoose = require("../../config/db");

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

    static salvaSessione(sessione, ID_utente) {
        return new Promise(async (resolve, reject) => {
            try {
            const nuovaSessione = new SessioneModel({
                ID_utente: ID_utente,
                data: new Date(Date.UTC(sessione.data.anno, sessione.data.mese - 1, sessione.data.giorno)),
                minuti: sessione.tempo.ore * 60 + sessione.tempo.minuti,
            });
        
            await nuovaSessione.save();
            resolve();
            } catch (error) {
            console.error(`Errore durante il salvataggio della sessione per l'utente ${ID_utente}: ${error}`);
        
            // Gestione degli errori specifici
            if (error.name === 'ValidationError') {
                // Validazione fallita
                reject({ errorCode: 1001, message: 'Errore di validazione dei dati' });
            } else if (error.name === 'MongoError' && error.code === 11000) {
                // Chiave duplicata
                reject({ errorCode: 1002, message: 'Duplicazione della chiave unica' });
            } else {
                // Altro errore generico
                reject({ errorCode: 1000, message: 'Errore generico durante il salvataggio della sessione' });
            }
            }
        });
    }

}
    
    

module.exports = GestoreDB;