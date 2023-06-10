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
  if(!req.body.email || !req.body.password){
    return res.status(400).json({ success: false, message: `I parametri "email" o "password" mancanti.` });
  }
  GestoreDB.login(req.body.email, req.body.password)
      .then((esito) => {
          if (esito) {
              return GestoreDB.getIDfromEmail(req.body.email)
                  .then((esito) => {
                      return res.status(200).json({
                          success: true,
                          token: jwt.sign({ id: esito }, process.env.ACCESS_TOKEN_SECRET),
                      });
                  });
          } else{
              res.status(401).json({success: false, message: `Autenticazione non riuscita, credenziali non corrispondenti o valide`})
          }
      })
      .catch((error) => {
          res.status(500).json({success: false, message: `L'operazione di richiesta di autenticazione non è andata a buon fine. ${error.message}`})
      });
})

router.post("/nuova-autenticazione", bodyParser.json(), async (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.username){
    return res.status(400).json({ success: false, message: `I parametri "username, "email" o "password" mancanti.` }); 
  }

  try {
    if (await GestoreDB.controllaEsistenzaEmail(req.body.email)) {
      return res.status(409).json({ success: false, message: `Errore, email già utilizzata` });
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
      return res.status(401).json({ success: false, message: `Le credenziali fornire non sono valide!` });
    }

    const token = jwt.sign({ email: req.body.email, password: req.body.password, username: req.body.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    const accountConfirmationLink = process.env.BASE_URL + `/verifica-registrazione/${token}`;

    await GestoreEmail.inviaEmailConfermaAcc([req.body.email], "Conferma Account", accountConfirmationLink);

    await GestoreDB.salvaToken(token);

    res.status(200).json({ success: true, message: `Email di Conferma Account inviata con successo!` });
  } catch (error) {
    console.error( `L'operazione di richiesta di registrazione non è andata a buon fine. ${error.message}`);
    res.status(500).json({ success: false, message:  `L'operazione di richiesta di registrazione non è andata a buon fine. ${error.message}` });
  }
});

router.post("/verifica-registrazione", bodyParser.json(), async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: `Il parametro "token" mancante!` }); 
  }

  if(!await GestoreDB.checkIfTokenExist(token)) {
    return res.status(409).json({ success: false, message: `Account già esistente!` });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(error, decodedToken) => {
    if (error) {
      return res.status(401).json({ success: false, message: `Token non valido o scaduto! ${error.message} ` });
    }

    const { email, password, username } = decodedToken;

    try {
      await GestoreDB.registra(username, email, password);

      await GestoreDB.deleteToken(token);

      res.status(201).json({ success: true, message: `Account registrato con successo!` });

    } catch (error) {
      res.status(500).json({ success: false, message: `L'operazione di registrazione non è andata a buon fine. ${error.message}` });
    }
  });
});



router.post("/richiesta-nuova-password", (req, res) => {
  const { email } = req.body;

  if (email == undefined) {
    return res.status(400).json({ success: false, message: `Il parametro "email" mancante!` });
  } else {
    GestoreDB.getDataFromEmail(email)
      .then((result) => {
        if (result == null) {
          return res.status(404).json({ success: false, message: `Utente non trovato con l'email fornita!` });
        }

        // recupero password solo se l'account è stato creato con la registrazione interna di CHRON        
        const password = email + process.env.CLIENT_ID;

        GestoreDB.login(email, password).then((login) => {
          if(login) {
            return res.status(409).json({ success: false, message: `Non puoi recuperare la password di un account creato con  la registrazione esterna. Per autenticarti utilizza direttamente l'apposito bottone "accedi con google".` });
          } else {
            
            // Procedi con il recupero della password
            const token = jwt.sign( { id: result._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

            const recoveryLink = process.env.BASE_URL + `/richiesta-reset-password/${token}`;

            GestoreEmail.inviaEmailRecuperoPwd([email], "Recupero password", recoveryLink);

            res.status(200).json({ success: true, message: `Email inviata con successo!` });
          }
        });


      })
      .catch((error) => {
        res.status(500).json({ success: false,  message: `L'operazione di richiesta nuova passsword non è andato a buon fine. ${error.message}` });
      });
  }
});

// API per il reset della password
router.post("/richiesta-reset-password", (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: `I parametri "token" o "password" sono mancanti!` });
  }

  // Verifica e decodifica del token di recupero password
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ success: false, message: `Token non valido o scaduto! ${error.message}`});
    }

    const { id } = decodedToken;

    // Aggiornamento della password nel database
    GestoreDB.aggiornaPassword(id, password)
      .then(() => {
        res.status(200).json({ success: true, message: `Password aggiornata con successo!` });
      })
      .catch((error) => {
        res.status(500).json({ success: false,  message: `L'operazione di ripristino della password non è andato a buon fine. ${error.message}` });
      });
    });
});


router.post("/autenticazioneEsterna", async (req, res) => {
  const { gToken, clientId } = req.body;

  if (!gToken || !clientId) {
    return res.status(400).json({ success: false, message: `I parametri "gToken" o "clientId" mancanti!` });
  }

  try {
    const jwtDetail = jwt.decode(gToken);
    const { name, email, userName, email_verified } = jwtDetail;
    const password = email + clientId;

    if (email_verified) {

      const esiste = await GestoreDB.controllaEsistenzaEmail(email);

      if (esiste) {
        // login solo se l'account non è stato creato con la registrazione interna di CHRON
        const login = await GestoreDB.login(email, password);

        if(!login) {
          return res.status(409).json({ success: false, message: `Questa email è già stata utilizza per creare l'account con  la registrazione interna di CHRON. Se hai dimenicato la password puoi recuperarla tramite l'apposito form` });
        }

        const _id = await GestoreDB.getIDfromEmail(email);
        const token = jwt.sign({ id: _id }, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({ success: true, message: `L'autenticazione effettuata con successo!`, token });

      } else {
        // registrazione (con notifica email) e login
        const result = await GestoreDB.registra(name, email, password);

        const token = jwt.sign({ id: result._id }, process.env.ACCESS_TOKEN_SECRET);

        GestoreEmail.inviaEmailBenvenuto([email], "ACCOUNT CREATO");

        return res.status(201).json({ success: true, message: `Utente registrato e l'autenticazione effettuata con successo!`, token });

      }
    } else {
      return res.status(401).json({ success: false, message: `L'operazione di autenticazione esterna non è andata a buon fine. L'email non è verificata!` });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: `L'operazione di autenticazione esterna non è andata a buon fine. ${error.message}` });
  }
});



module.exports = router;
