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
                res.status(401).json({success: "false"})
            }
        })
        .catch((error) => {
            res.status(500).json({success: "errore", error: error.message})
        });
})

// REVISIONATA [ XXX ]
router.post("/registrazione", bodyParser.json(), (req, res) => {
    if (GestoreDB.controllaEsistenzaEmail(req.body.email)) {
        return res.status(409).json({success: "false"})
    }
    GestoreDB.registra(req.body.username, req.body.email, req.body.password)
        .then(() => {
            return res.status(201).json({
                success: "true",
                token: jwt.sign({ emal: `${req.body.email}` }, process.env.ACCESS_TOKEN_SECRET),
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({success: "errore", error: error.message})
        });
    
})

router.get("/data", (req, res) => {
    GestoreDB.getDataFromID(req.id)
        .then((esito) => {
            res.json(esito)
        })
})

module.exports = router