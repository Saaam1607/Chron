
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const TokenModel = mongoose.model('Token', tokenSchema);

module.exports = TokenModel;