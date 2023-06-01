const GestoreDB = require("../components/gestoreDB/gestoreDB")

function verificaAutenticazione(req, res, next) {

    if (!req.id) {
        // Utente non autenticato
        res.status(401).json({ success:false, message: 'Utente non autenticato' });
    } else {

        const esito = GestoreDB.controllaEsistenzaUtente(req.id)
        console.log("esito: " + esito)
        if (esito) {
            // Utente autenticato
        } else {
            res.status(401).json({ success:false, message: 'Utente non autenticato' });
        }

        next();
    }
}

module.exports = verificaAutenticazione;