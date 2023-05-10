const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    console.log("qualcosa ricevo")
    res.json({esito: "Example!"})
})

module.exports = router