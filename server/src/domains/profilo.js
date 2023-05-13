const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

router.post("/login", bodyParser.json(), (req, res) => {
    GestoreDB.login(req.body.email, req.body.password)
    res.json({succes: "true"})
})

module.exports = router