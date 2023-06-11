const jwt = require("jsonwebtoken")

const GestoreDB = require("../components/gestoreDB/gestoreDB");
const { error } = require("console");



async function leggiToken(req, res, next) {

    // lettura dell'header
    const authHeader = req.headers["authorization"]
    if (authHeader === undefined) {
        return res.status(401).json({ success:false, message: 'Utente non autenticato, authorization header non presente' });
    }

    // lettura del token
    const token = authHeader && authHeader.split(" ")[1];
    if (token === undefined){
        return res.status(401).json({ success:false, message: 'Utente non autenticato, token non presente' });
    }

    // decodifica del token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return res.status(401).json({ success:false, message: `Utente non autenticato: ${error}` });
    }

    // controllo validità id
    const esitoControlloID = await GestoreDB.checkIfObjectId(decoded)
    if (!esitoControlloID) {
        return res.status(401).json({ success:false, message: 'Utente non autenticato, codice non valido' });
    }

    // controllo esistenza utente
    const esitoControlloEsistenza = GestoreDB.controllaEsistenzaUtente(decoded)
    if (!esitoControlloEsistenza) {
        return res.status(401).json({ success:false, message: 'Utente non autenticato, utente non esistente' });
    }
    
    req.id = decoded.id;
    next();

}


module.exports = leggiToken;