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
    //membro_id = "645ffebeb63cbd07bd5e9fbe"
    GestoreDB.ottieniGruppiMembro(membro_id)
        .then((results) => {
                // if (results) {
                //     results.forEach((result) => {
                //         console.log(result); // Print each result
                        
                //     })
                // }
                console.log(results)
                res.status(200).json(results)
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: "Errore durante la lettura dei dati"})
            });
    res.status(200)
   
})



module.exports = router