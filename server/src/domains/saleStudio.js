require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())



router.get("/", async (req, res) => {
    try {

        if (req.query.nome) {
            const listaSaleStudio = await GestoreDB.leggiSaleStudioPerNome(req.query.nome);
            return res.status(200).json(listaSaleStudio);
        }

        if (req.query.indirizzo) {
            const listaSaleStudio = await GestoreDB.leggiSaleStudioPerIndirizzo(req.query.indirizzo);
            return res.status(200).json(listaSaleStudio);
        }

        const listaSaleStudio = await GestoreDB.leggiSaleStudio();
        return res.status(200).json(listaSaleStudio);

    } catch (error) {
        return res.status(500).json({ error: "Errore durante la lettura delle sale studio" });
    }

})




module.exports = router