function verificaAutenticazione(req, res, next) {

    if (!req.id) {
      // Utente non autenticato
      res.status(401).json({ success:false, message: 'Utente non autenticato' });
    } else {
      // Utente autenticato, passa al middleware successivo
      next();
    }
}

module.exports = verificaAutenticazione;