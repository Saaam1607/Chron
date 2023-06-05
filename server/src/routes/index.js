require('dotenv').config();

const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const timer = require("../domains/timer")
const profilo = require("../domains/profilo")
const todos = require("../domains/todo")
const sessione_grafici = require("../domains/sessione_grafici")


function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"]
    
    const token = authHeader && authHeader.split(" ")[1];
    if (token) { 
        const decoded = jwt.decode(token);
        const id = decoded.id; // Assuming you have the user ID extracted from the decoded token
        req.id = id; // Save the user ID to the request object
    }
    next(); // Call the next middleware or route handler
}

function verificaAutenticazione(req, res, next) {
      if (!req.id) {
        // Utente non autenticato
        res.status(401).json({ success:false, message: 'Utente non autenticato' });
      } else {
        // Utente autenticato, passa al middleware successivo
        next();
      }
}


router.use("/api/v1/timer/salva-sessione", authenticateToken, verificaAutenticazione, timer)
router.use("/api/v1/timer", authenticateToken, timer)
router.use("/api/v1/profilo", authenticateToken, profilo)
router.use("/api/v1/todos", authenticateToken, verificaAutenticazione,todos)
router.use("/api/v1/grafici", authenticateToken, verificaAutenticazione, sessione_grafici)


module.exports = router