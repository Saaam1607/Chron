const mongoose = require("mongoose")

let SalaStudioSchema = new mongoose.Schema({
    _id: {type: mongoose.ObjectId},
    name: String,
    address: String,
    restrictions: String,
    rating: Int16Array,
    openingHours: [{
        day: String,
        openingTime: String,
        closingTime: String
    }]
});

let SalaStudio = mongoose.model('studyroom', SalaStudioSchema);

module.exports = SalaStudio;