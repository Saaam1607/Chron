const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  ID_utente: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  ID_leader: {
    type: mongoose.ObjectId,
    ref: 'User',
    default: null
  },
  nome: {
    type: String,
    required: true
  },
  dataScadenza: {
    type: Date,
    default: null
  },
  nomeGruppo: {
    type: String,
    default: null
  },
  contrassegna: {
    type: Boolean,
    default: false
  }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;