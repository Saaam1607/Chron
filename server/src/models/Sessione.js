const mongoose = require('mongoose');

// Definizione dello schema per il modello Sessione
const sessioneSchema = new mongoose.Schema({
  ID_utente: Number,  
  data: Date,
  minuti: Number,
});

// Creazione del modello Sessione
const SessioneModel = mongoose.model('Session', sessioneSchema);

module.exports = SessioneModel;