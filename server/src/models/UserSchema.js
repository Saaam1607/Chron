const GestoreDB = require("../components/gestoreDB/gestoreDB")

const mongoose = require("mongoose")

let UserSchema = new mongoose.Schema({
    _id: {type: mongoose.ObjectId},
    username: {type: String},
    email: {type: String},
    password: {type: String}
});

let Credenziali = mongoose.model('user', UserSchema); 

module.exports = Credenziali;
