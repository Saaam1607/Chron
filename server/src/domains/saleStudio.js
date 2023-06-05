require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")


router.get("/", async (req, res) => {

    try {
        const listaSaleStudio = await GestoreDB.leggiSaleStudio();
        res.status(200).json(listaSaleStudio);
    } catch (error) {
        res.status(500).json({ error: "Errore durante la lettura delle sale studio" });
    }

})




module.exports = router