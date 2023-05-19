const mongoose = require('mongoose');

// Definizione dello schema per il modello Sessione
const sessioneSchema = new mongoose.Schema({
  _id: {type: mongoose.ObjectId},
  ID_utente: {type: mongoose.ObjectId, ref: 'User'},
  data: Date,
  minuti: Number,
});

// Creazione del modello Sessione
const SessioneModel = mongoose.model('Session', sessioneSchema);

module.exports = SessioneModel;