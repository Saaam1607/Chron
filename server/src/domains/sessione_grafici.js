const express = require("express")
const router = express.Router()
//const ListaSessioni = require("../components/chron/chron.js")
const  GestoreDB  = require('../components/gestoreDB/gestoreDB');

let isFirstTime = true;
//const listaSessioni = new ListaSessioni(1);


router.get('/', async (req, res) => {
    //console.log(req.id);
     if(isFirstTime && req.id){
         isFirstTime = false;
     }
    
	try {
            //fetch data from db
            const sessions = await GestoreDB.leggiStorico(req.id);
            
            // //create array for sessioni.date without hours
            // const dateArray = [];
            // sessions.forEach((sessione) => {
            //     dateArray.push(sessione.data.toISOString().slice(0,10));
            // });
            // //array of minutes
            // const minutiArray = [];
            // sessions.forEach((sessione) => {
            //     minutiArray.push(sessione.minuti);
            // }); 



            // const dateArrayUnique = [...new Set(dateArray)];
            //create array of minuti sum for each date
            // const minutiArray = [];
            // dateArrayUnique.forEach((date) => {
            //     let minuti = 0;
            //     sessions.forEach((sessione) => {
            //         if(sessione.data.toISOString().slice(0,10) === date){
            //             minuti += sessione.minuti;
            //         }
            //     });
            //     minutiArray.push(minuti);
            // });


            //console.log(`Invio di date ${dateArray} e minuti ${minutiArray}`);
            res.status(200).json({ success: true, sessions: sessions});
        } catch (error) {
        console.error(`Errore durante la lettura delle sessioni: ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di lettura delle task non è andata a buon fine. ${error.message}` });
	    }
});

module.exports = router;