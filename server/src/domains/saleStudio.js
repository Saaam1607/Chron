require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")


router.get("/", (req, res) => {
    // carico dati su db
    console.log("ECCOMi")
    res.send("FUNZIONA")
})




module.exports = router