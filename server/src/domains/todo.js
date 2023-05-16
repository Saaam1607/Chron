const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

router.post("/identifica", bodyParser.json(), (req, res) => {
    console.log(req.body.token)
    
})

module.exports = router