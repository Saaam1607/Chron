require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")



router.get("/", (req, res) => {
    if (req.id == undefined) {
        res.status(400).json({success: "false", message: "Errore, ID non trovato"})
    } else {
        GestoreDB.getDataFromID(req.id)
            .then((esito) => {
                res.status(200).json(esito)
            })
                .catch((error) => {
                    res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                });
    }
})



router.put("/username", bodyParser.json(), async (req, res) => {

    try {

        // controllo corrispondenza id password
        const esitoControlloPassword = await GestoreDB.controllaCredenziali(req.id, req.body.password)
        if (!esitoControlloPassword) {
            return res.status(401).json({success: false, message: `Errore, password errata` })
        }

        // aggiornamento username
        await GestoreDB.modificaUsername(req.id, req.body.username)

        // ritorno esito positivo
        return res.status(200).json({success: true, message: `Username aggiornato` })

    } catch (error) {
        return res.status(500).json({success: false, message: `Errore durante l'aggiornamento dello username: ${error}` })
    }

})

router.put("/email", bodyParser.json(), async (req, res) => {

    try {

        // controllo corrispondenza id password
        const esitoControlloPassword = await GestoreDB.controllaCredenziali(req.id, req.body.password)
        if (!esitoControlloPassword) {
            return res.status(401).json({success: false, message: `Errore, password errata` })
        }

        // aggiornamento username
        await GestoreDB.modificaEmail(req.id, req.body.email)

        // ritorno esito positivo
        return res.status(200).json({success: true, message: `Email aggiornata` })

    } catch (error) {
        return res.status(500).json({success: false, message: `Errore durante l'aggiornamento dell'email: ${error}` })
    }

})


module.exports = router