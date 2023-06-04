const express = require("express")
const session = require('express-session')
const cookieParser = require("cookie-parser");

const DefaultSettings = require("./../components/timer/timerSettings")
const { Data, Tempo, Sessione } = require('../components/utils/utils');
const GestoreDB = require("../components/gestoreDB/gestoreDB")

const router = express.Router()
const verificaAutenticazione = require("./../routes/verificaAutenticazione") // middleware per verificare l'autenticazione



router.put('/', verificaAutenticazione, (req, res) => {

    const minuti = req.body.minuti;
    const date = new Date(req.body.date);

    if (!minuti || typeof minuti !== 'number' || !date || isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Parametro "minuti" o "date" mancante o non valido.' });
    }

    const tempo = new Tempo();
    tempo.aggiungiTempo(minuti);

    const sessione = new Sessione(new Data(date.getDate(), date.getMonth() + 1,date.getFullYear()), tempo, req.id);

    GestoreDB.salvaSessione(sessione)
        .then((result) => {
            res.status(result.stato).json({ success: true, message: 'Sessione salvata con successo.' });
        })
        .catch(error => {
            console.error(`Non è stato possibile salvare la sessione. ${error.message}`);
            res.status(500).json({ success: false, message: error.message });
        });
});



module.exports = router
