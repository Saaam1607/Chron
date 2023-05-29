require('dotenv').config();

const express = require("express")
const router = express.Router()
const cors = require("cors");
const bodyParser = require("body-parser"); 
const jwt = require("jsonwebtoken")
const verificaAutenticazione = require("./verificaAutenticazione") // middleware per verificare l'autenticazione

const timer = require("../domains/timer")
const gruppi = require("../domains/gruppi")
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

// Imposta l'header Access-Control-Allow-Origin per consentire tutte le origini
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
  router.use(cors());
    
  next();
});

router.use(bodyParser.json());
router.use("/api/v1/timer", authenticateToken, timer)
router.use("/api/v1/profilo", authenticateToken, profilo)
router.use("/api/v1/gruppi", authenticateToken, verificaAutenticazione, gruppi)
router.use("/api/v1/todos", authenticateToken, verificaAutenticazione, todos)


module.exports = router
