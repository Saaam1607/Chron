require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

router.get("/membro", bodyParser.json(), (req, res) => {
    //GestoreDB.ottieniGruppiLeader(req.id)
    GestoreDB.ottieniGruppiMembro(0000)
        .then((results) => {
                if (results) {
                    results.forEach((result) => {
                        console.log(result); // Print each result
                        
                    })
                }
                res.status(200).json(results)
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: "Errore durante la lettura dei dati"})
            });
    res.status(200)
   
})

module.exports = router