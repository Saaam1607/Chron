const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  ID_utente: {
      type: Number,
      required: true
  },
  nome: {
      type: String,
      required: true
  },
  dataScadenza: {
      type: Date,
      default: null
  },
  gruppoID: {
      type: Number,
      default: null
  },
  contrassegna: {
      type: Boolean,
      default: false
  }
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;