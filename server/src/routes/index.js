const express = require("express")
const router = express.Router()

const example = require("../domains/example")
const timer = require("../domains/timer")



router.use("/example", example)
router.use("/api/v1/timer", timer)

module.exports = router