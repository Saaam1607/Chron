require('dotenv').config();

const express = require("express")
const router = express.Router()
const cors = require("cors");
const jwt = require("jsonwebtoken")
const verificaAutenticazione = require("./verificaAutenticazione") // middleware per verificare l'autenticazione

const timer = require("../domains/timer")
const profilo = require("../domains/profilo")
const todos = require("../domains/todo")


function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

    if (token != "false" && token != undefined) { 
        const decoded = jwt.decode(token);
        const id = decoded.id; // Assuming you have the user ID extracted from the decoded token
        req.id = id; // Save the user ID to the request object
    }
    next(); // Call the next middleware or route handler
}

router.use(cors());
router.use("/api/v1/timer", authenticateToken, timer)
router.use("/api/v1/profilo", authenticateToken, profilo)
router.use("/api/v1/todos", authenticateToken, verificaAutenticazione, todos)


module.exports = router