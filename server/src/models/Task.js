const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  ID_utente: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true
  },
  ID_gruppo: {
    type: mongoose.ObjectId,
    ref: 'group',
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
  contrassegna: {
    type: Boolean,
    default: false
  }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;