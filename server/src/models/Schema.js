const mongoose = require("mongoose")

let Schema = new mongoose.Schema({
    _id: {type: mongoose.ObjectId},
    username: {type: String},
    email: {type: String},
    password: {type: String}
});

let Credenziali = mongoose.model('user', Schema); 

module.exports = Credenziali;