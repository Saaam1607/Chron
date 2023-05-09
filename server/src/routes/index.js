const express = require("express")
const router = express.Router()

const example = require("../domains/example")



router.use("/example", example)

module.exports = router