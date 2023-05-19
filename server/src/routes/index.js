require('dotenv').config();

const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const timer = require("../domains/timer")
const profilo = require("../domains/profilo")

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
    console.log("Sono nel middleware verificaAutenticazione")
      if (!req.id) {
        // Utente non autenticato
        res.status(401).json({ success:false,  errore: 'Utente non autenticato' });
      } else {
        // Utente autenticato, passa al middleware successivo
        next();
      }
}

router.use("/api/v1/timer/salva-sessione",authenticateToken, verificaAutenticazione, timer)
router.use("/api/v1/timer", authenticateToken, timer)
router.use("/api/v1/profilo", authenticateToken, profilo)

module.exports = router