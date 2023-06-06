require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")
const gestoreEmail = require("../components/gestoreEmail/gestoreEmail");
const htmlBodyConfermaEmail = require("fs").readFileSync(require("path").join(__dirname, "..", "components", "gestoreEmail", "confermaModificaEmail.html" ), "utf8");


var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")



router.get("/", (req, res) => {
    if (req.id == undefined) {
        res.status(400).json({success: "false", message: "Errore, ID non trovato"})
    } else {
        GestoreDB.getDataFromID(req.id)
            .then((esito) => {
                res.status(200).json(esito)
            })
                .catch((error) => {
                    res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                });
    }
})



router.put("/username", bodyParser.json(), async (req, res) => {

    try {

        // controllo corrispondenza id password
        const esitoControlloPassword = await GestoreDB.controllaCredenziali(req.id, req.body.password)
        if (!esitoControlloPassword) {
            return res.status(401).json({success: false, message: `Errore, password errata` })
        }

        // aggiornamento username
        await GestoreDB.modificaUsername(req.id, req.body.username)

        // ritorno esito positivo
        return res.status(200).json({success: true, message: `Username aggiornato` })

    } catch (error) {
        return res.status(500).json({success: false, message: `Errore durante l'aggiornamento dello username: ${error}` })
    }

})

router.put("/email", bodyParser.json(), async (req, res) => {

    try {

        // controllo corrispondenza id password
        const esitoControlloPassword = await GestoreDB.controllaCredenziali(req.id, req.body.password)
        if (!esitoControlloPassword) {
            return res.status(401).json({success: false, message: `Errore, password errata` })
        }

        const token = jwt.sign({ email: req.body.email, id: req.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        const emailConfirmationLink = process.env.BASE_URL + `/verifica-email/${token}`;

        const formattedHtmlBody = htmlBodyConfermaEmail.replace("{{emailConfirmationLink}}", emailConfirmationLink);

        await gestoreEmail([req.body.email], "Conferma Modifica Email", formattedHtmlBody);
    
        await GestoreDB.salvaToken(token);

        // ritorno esito positivo
        res.status(200).json({ success: true, message: "Email di verifica inviata con successo!" });

    } catch (error) {
        return res.status(500).json({success: false, message: `Errore durante l'invio dell'email: ${error}` })
    }

})

router.put("/verifica-email", bodyParser.json(), async (req, res) => {
    const { token } = req.body;

    if(!await GestoreDB.checkIfTokenExist(token)) {
      return res.status(409).json({ success: false, message: "Email già aggiornata o token non valido!" });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decodedToken) => {
        if (error) {
          return res.status(401).json({ success: false, message: "Token di verifica non valido o scaduto." });
        }
    
        const { email, id } = decodedToken;
    
        try {

            await GestoreDB.modificaEmail(id, email)

            await GestoreDB.deleteToken(token);
    
            res.status(201).json({ success: true, message: "Email aggiornata" });
    
        } catch (error) {
            res.status(500).json({ success: false, message: `Errore durante l'aggiornamento dell'email: ${error}` });
        }
    });
});

router.put("/password", bodyParser.json(), async (req, res) => {

    try {

        // controllo corrispondenza id password
        const esitoControlloPassword = await GestoreDB.controllaCredenziali(req.id, req.body.password)
        if (!esitoControlloPassword) {
            return res.status(401).json({success: false, message: `Errore, password errata` })
        }

        // aggiornamento username
        await GestoreDB.modificaPassword(req.id, req.body.nuovaPassword)

        // ritorno esito positivo
        return res.status(200).json({success: true, message: `Password aggiornata` })

    } catch (error) {
        return res.status(500).json({success: false, message: `Errore durante l'aggiornamento della password: ${error}` })
    }

})


module.exports = router