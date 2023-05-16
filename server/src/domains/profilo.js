require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

router.post("/login", bodyParser.json(), (req, res) => {
    GestoreDB.login(req.body.email, req.body.password)
        .then((esito) => {
            //console.log(esito)
            if (esito) {
                GestoreDB.getIDfromEmail(req.body.email)
                    .then((esito) => {
                        return res.json({
                            success: "true",
                            token: jwt.sign({ id: esito }, process.env.ACCESS_TOKEN_SECRET),
                        });
                    })
            } else{
                res.json({success: "false"})
            }
        })
        .catch((error) => {
            console.error(error);
            res.json({success: "false"})
        });
})

router.post("/registrazione", bodyParser.json(), (req, res) => {
    GestoreDB.registra(req.body.username, req.body.email, req.body.password)
        .then((esito) => {
            console.log(esito)
            if (esito) {
                return res.json({
                    success: "true",
                    token: jwt.sign({ emal: `${req.body.email}` }, process.env.ACCESS_TOKEN_SECRET),
                  });
            } else{
                res.json({success: "false"})
            }
        })
        .catch((error) => {
            console.error(error);
            res.json({success: "false"})
        });
})

router.get("/data", (req, res) => {
    GestoreDB.getDataFromID(req.id)
        .then((esito) => {
            res.json(esito)
        })
})

const Credenziali = require("../models/Schema");
const mongoose = require('mongoose')

module.exports = router