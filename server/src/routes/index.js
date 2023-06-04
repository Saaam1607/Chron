require('dotenv').config();

const express = require("express")
const router = express.Router()
const cors = require("cors");
const bodyParser = require("body-parser"); 
const jwt = require("jsonwebtoken")

const leggiToken = require("./leggiToken")

const timer = require("../domains/timer")
const timerSessione = require("../domains/timerSessione")
const gruppi = require("../domains/gruppi")
const profilo = require("../domains/profilo")
const profiloData = require("../domains/profiloData")
const todos = require("../domains/todo")

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



router.use("/api/v1/timer", timer)
router.use("/api/v1/timerSessione", leggiToken, timerSessione)

router.use("/api/v1/profilo", profilo)
router.use("/api/v1/profiloData", leggiToken, profiloData)

router.use("/api/v1/gruppi", leggiToken, gruppi)

router.use("/api/v1/todos", leggiToken, todos)


module.exports = router
