require("./config/db")

const app = require("express")()
const bodyParser = require("express").json
const routes = require("./routes")

app.use(bodyParser())

app.use(routes)

module.exports = app