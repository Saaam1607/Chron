const mongoose = require("mongoose")

let GruppoSchema = new mongoose.Schema({
    _id: {type: mongoose.ObjectId},
    name: {type: String},
    leader_id: {type: mongoose.ObjectId},
    members_id: [{ type: mongoose.ObjectId }]
});

let Gruppo = mongoose.model('gruppi', GruppoSchema);

module.exports = Gruppo;