require("dotenv").config();

const express = require("express");
const router = express.Router();
const GestoreDB = require("../components/gestoreDB/gestoreDB");
const GestoreEmail = require("../components/gestoreEmail/gestoreEmail");


var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

router.post("/autenticazione", bodyParser.json(), (req, res) => {
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

router.post("/nuova-autenticazione", bodyParser.json(), async (req, res) => {
  try {
    if (GestoreDB.controllaEsistenzaEmail(req.body.email)) {
      return res.status(409).json({ success: false, message: "Errore, email già utilizzata" });
    }

    if (
      // controlli sul formato della password
      req.body.password.length < 8 ||
      !/[a-z]/.test(req.body.password) ||
      !/[A-Z]/.test(req.body.password) ||
      !/\d/.test(req.body.password) ||
      // controlli sul formato dell'email
      !req.body.email.includes("@") ||
      // controlli sul formato dell'username
      req.body.username.length < 4
    ) {
      return res.status(401).json({ success: false, message: "Errore, credenziali non valide" });
    }

    const token = jwt.sign({ email: req.body.email, password: req.body.password, username: req.body.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    const accountConfirmationLink = process.env.BASE_URL + `/verifica-registrazione/${token}`;

    await GestoreEmail.inviaEmailConfermaAcc([req.body.email], "Conferma Account", accountConfirmationLink);

    await GestoreDB.salvaToken(token);

    res.status(200).json({ success: true, message: "Email di verifica inviata con successo!" });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({ success: false, message: "Errore durante la registrazione e invio email" });
  }
});

router.post("/verifica-registrazione", bodyParser.json(), async (req, res) => {
  const { token } = req.body;

  if(!await GestoreDB.checkIfTokenExist(token)) {
    return res.status(409).json({ success: false, message: "Account già esistente!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(error, decodedToken) => {
    if (error) {
      return res.status(401).json({ success: "false", message: "Token di verifica non valido o scaduto." });
    }

    const { email, password, username } = decodedToken;

    try {
      await GestoreDB.registra(username, email, password);

      await GestoreDB.deleteToken(token);

      res.status(201).json({ success: true, message: "Account registrato con successo!" });

    } catch (error) {
      res.status(500).json({ success: false, message: `Errore durante la registrazione: ${error}` });
    }
  });
});



router.post("/richiesta-nuova-password", (req, res) => {
  const { email } = req.body;

  if (email == undefined) {
    return res.status(400).json({ success: "false", message: "Errore, email mancante!" });
  } else {
    GestoreDB.getDataFromEmail(email)
      .then((result) => {
        if (result == null) {
          return res.status(404).json({ success: "false", message: "Utente non trovato!" });
        }

        // recupero password solo se l'account è stato creato con la registrazione interna di CHRON        
        const password = email + process.env.CLIENT_ID;

        GestoreDB.login(email, password).then((login) => {
          if(login) {
            return res.status(409).json({ success: false, message: `Non puoi recuperare la password di un account creato con  la registrazione esterna. Per autenticarti utilizza direttamente l'apposito bottone` });
          } else {
            
            // Procedi con il recupero della password
            const token = jwt.sign( { id: result._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

            const recoveryLink = process.env.BASE_URL + `/richiesta-reset-password/${token}`;

            GestoreEmail.inviaEmailRecuperoPwd([email], "Recupero password", recoveryLink);

            res.status(200).json({ success: "true", message: "Email inviata con successo!" });
          }
        });


      })
      .catch((error) => {
        res.status(500).json({ success: "false",  message: `Errore durante il forgot-password: ${error}` });
      });
  }
});

// API per il reset della password
router.post("/richiesta-reset-password", (req, res) => {
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
