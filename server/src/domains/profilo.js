require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

// REVISIONATA [ XXX ]
router.post("/login", bodyParser.json(), (req, res) => {
    GestoreDB.login(req.body.email, req.body.password)
        .then((esito) => {
            if (esito) {
                return GestoreDB.getIDfromEmail(req.body.email)
                    .then((esito) => {
                        return res.status(200).json({
                            success: "true",
                            token: jwt.sign({ id: esito }, process.env.ACCESS_TOKEN_SECRET),
                        });
                    });
            } else{
                res.status(401).json({success: "false", message: "Autenticazione non riuscita, credenziali non corrispondenti o valide"})
            }
        })
        .catch((error) => {
            res.status(500).json({success: "false", message: "Errore durante l'autenticazione"})
        });
})

// REVISIONATA [ XXX ]
router.post("/registrazione", bodyParser.json(), (req, res) => {
    if (GestoreDB.controllaEsistenzaEmail(req.body.email)) {
        return res.status(409).json({success: "false", message: "Errore, email già utilizzata"})
    }
    if (
        // controlli sul formato password
        (req.body.password).length < 8 ||
        !/[a-z]/.test(req.body.password) ||
        !/[A-Z]/.test(req.body.password) ||
        !/\d/.test(req.body.password) ||

        // controlli sul formato email
        !(req.body.email).includes("@") ||

        // controlli sul formato username
        (req.body.username).length < 4

    ){
        return res.status(401).json({success: "false", message: "Errore, credenziali non valide"})
    }
    GestoreDB.registra(req.body.username, req.body.email, req.body.password)
        .then(() => {
            return res.status(201).json({
                success: "true",
                token: jwt.sign({ emal: `${req.body.email}` }, process.env.ACCESS_TOKEN_SECRET),
            });
        })
        .catch((error) => {
            res.status(500).json({success: "errore", message: "Errore durante la registrazione"})
        });  
})

router.get("/data", (req, res) => {
    if (req.id == undefined) {
        res.status(401).json({success: "false", message: "Errore, ID non trovato"})
    } else {
        GestoreDB.getDataFromID(req.id)
        .then((esito) => {
            res.status(200).json(esito)
        })
        .catch((error) => {
            res.status(500).json({success: "false", message: "Errore durante la lettura dei dati"})
        });
    }
})

module.exports = router