const express = require("express")
const router = express.Router()

const example = require("../domains/example")
const timer = require("../domains/timer")
const profilo = require("../domains/profilo")

router.use("/example", example)
router.use("/api/v1/timer", timer)
router.use("/api/v1/profilo", profilo)

module.exports = router