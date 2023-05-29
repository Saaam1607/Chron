require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

router.get("/membro", bodyParser.json(), (req, res) => {
    GestoreDB.ottieniGruppiMembro(req.id)
        .then((results) => {
                if (results.length > 0) {
                    res.status(200).json({success: "true", result: results})
                }
                else {
                    res.status(204)
                }
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
            });
})



router.get("/leader", bodyParser.json(), (req, res) => {
    try{
    GestoreDB.ottieniGruppiLeader(req.id)
        .then((results) => {
                if (results.length > 0) {
                    res.status(200).json({success: "true", result: results})
                }
                else {
                    res.status(204)
                }
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
            });
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
    }
})



module.exports = router