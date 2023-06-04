require("dotenv").config();

const express = require("express");
const router = express.Router();
const GestoreDB = require("../components/gestoreDB/gestoreDB");
const gestoreEmail = require("../components/gestoreEmail/gestoreEmail");
const htmlBody = require("fs").readFileSync(require("path").join(__dirname, "..", "components", "gestoreEmail", "recuperoPassword.html" ), "utf8");

var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

router.post("/login", bodyParser.json(), (req, res) => {
  GestoreDB.login(req.body.email, req.body.password)
      .then((esito) => {
          if (esito) {
              return GestoreDB.getIDfromEmail(req.body.email)
                  .then((esito) => {
                      return res.status(200).json({
                          success: "true",
                          token: jwt.sign({ id: esito }, process.env.ACCESS_TOKEN_SECRET),
                      });
                  });
          } else{
              res.status(401).json({success: "false", message: "Autenticazione non riuscita, credenziali non corrispondenti o valide"})
          }
      })
      .catch((error) => {
          res.status(500).json({success: "false", message: "Errore durante l'autenticazione"})
      });
})

router.post("/registrazione", bodyParser.json(), (req, res) => {
  if (GestoreDB.controllaEsistenzaEmail(req.body.email)) {
      return res.status(409).json({success: "false", message: "Errore, email già utilizzata"})
  }
  if (
      // controlli sul formato password
      (req.body.password).length < 8 ||
      !/[a-z]/.test(req.body.password) ||
      !/[A-Z]/.test(req.body.password) ||
      !/\d/.test(req.body.password) ||

      // controlli sul formato email
      !(req.body.email).includes("@") ||

      // controlli sul formato username
      (req.body.username).length < 4

  ){
      return res.status(401).json({success: "false", message: "Errore, credenziali non valide"})
  }
  GestoreDB.registra(req.body.username, req.body.email, req.body.password)
      .then(() => {
          return res.status(201).json({
              success: "true",
              token: jwt.sign({ emal: `${req.body.email}` }, process.env.ACCESS_TOKEN_SECRET),
          });
      })
      .catch((error) => {
          res.status(500).json({success: "errore", message: "Errore durante la registrazione"})
      });  
})

router.get("/data", (req, res) => {
  if (req.id == undefined) {
    res.status(400).json({ success: "false", message: "Errore, ID non trovato" });
  } else {
    GestoreDB.getDataFromID(req.id)
      .then((esito) => {
        res.status(200).json(esito);
      })
      .catch((error) => {
        res.status(500).json({ success: "false",  message: `Errore durante la lettura dei dati: ${error}` });
      });
  }
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (email == undefined) {
    return res.status(400).json({ success: "false", message: "Errore, email mancante!" });
  } else {
    GestoreDB.getDataFromEmail(email)
      .then((result) => {
        if (result == null) {
          return res.status(404).json({ success: "false", message: "Utente non trovato!" });
        }
        const token = jwt.sign( { id: result._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        const recoveryLink = process.env.BASE_URL + `/reset-password/${token}`;

        const formattedHtmlBody = htmlBody.replace("{{passwordResetLink}}", recoveryLink);

        gestoreEmail([email], "Recupero password", formattedHtmlBody);

        res.status(200).json({ success: "true", message: "Email inviata con successo!" });
      })
      .catch((error) => {
        res.status(500).json({ success: "false",  message: `Errore durante il forgot-password: ${error}` });
      });
  }
});

// API per il reset della password
router.post("/reset-password", (req, res) => {
  const { token, password } = req.body;

  // Verifica e decodifica del token di recupero password
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ success: "false", message: "Invalid or expired token:" + error.message });
    }

    const { id } = decodedToken;

    // Aggiornamento della password nel database
    GestoreDB.aggiornaPassword(id, password)
      .then(() => {
        res.status(200).json({ success: "true", message: "Password aggiornata con successo!" });
      })
      .catch((error) => {
        res.status(500).json({ success: "false",  message: `Errore durante il reset-password: ${error}` });
      });
    });
});

module.exports = router;
