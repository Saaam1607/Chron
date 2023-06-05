const mongoose = require("mongoose")

let SalaStudioSchema = new mongoose.Schema({
    _id: {type: mongoose.ObjectId},
    name: String,
    address: String,
    restrictions: String,
    rating: Number,
    openingHours: [{
        day: String,
        isOpen: Boolean,
        openingTime: String,
        closingTime: String
    }]
});

let SalaStudio = mongoose.model('studyroom', SalaStudioSchema);

module.exports = SalaStudio;