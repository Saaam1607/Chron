mongoose = require("../../config/db");

const Credenziali = require("../../models/Schema");


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

}


module.exports = GestoreDB;