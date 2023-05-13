const mongoose = require("../../config/db");

let Schema = new mongoose.Schema({
    email: {type: String},
    password: {type: String}
});

// NOTA: "user" è il nome della collection al singolare (quindi "users")
let Credenziali = mongoose.model('user', Schema); 

class GestoreDB {
    static async login(email, password) {

        Credenziali.countDocuments({email: email, password: password})
        .then((result) => {
            if (result) {
                console.log("Entry exists");
            } else {
                console.log("Entry does not exist");
            }
        })
        .catch((error) => {
            console.error(error);
        });

    }   
}

module.exports = GestoreDB;




// mongoose.connect('mongodb://localhost:27017/eBookStore',{useNewUrlParser:true});

// //Schema model
// let newBookSchema = new mongoose.Schema({
//   bookName: {type: String},
//   bookSubtitle: {type: String},
//   publicationDate: {type: Number, default: new Date().getTime()} // i will have used new Date() only for future data query based on date
// });

// let Book = mongoose.model('Book', newBookSchema); // Capital letter will be better for distinguish from a normal variable and to remember easly
