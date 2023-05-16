mongoose = require("../../config/db");

const Credenziali = require("../../models/Schema");


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

  

    static getIDfromEmail(email) {
        return new Promise((resolve, reject) => {
            Credenziali.findOne({ email: email })
                .then((result) => {
                    if (result) {
                        resolve(result._id); // Resolve with true if the entry exists
                    } else {
                        resolve(false); // Resolve with false if the entry does not exist
                    }
                })
        });
    }

    static getDataFromID(id) {
        return new Promise((resolve, reject) => {
            Credenziali.findById(id)
                .then((result) => {
                    if (result) {
                        resolve({success: true, username: result.username, email: result.email}); // Resolve with true if the entry exists
                    } else {
                        resolve({success: false}); // Resolve with false if the entry does not exist
                    }
                })
        });
    }

}


module.exports = GestoreDB;