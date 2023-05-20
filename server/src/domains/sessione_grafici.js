const express = require("express")
const router = express.Router()
//const ListaSessioni = require("../components/chron/chron.js")
const  GestoreDB  = require('../components/gestoreDB/gestoreDB');

let isFirstTime = true;
//const listaSessioni = new ListaSessioni(1);


router.get('/', async (req, res) => {

    // if(isFirstTime && req.id){
    //     listaTask.ID_utente = req.id;
    //     isFirstTime = false;
    // }
    
	// try {
            //fetch data from db
            const sessions = await GestoreDB.leggiStorico();
            
            //create unique array for sessioni.date
            const dateArray = sessions.map((sessione) => sessione.data);
            const dateArrayUnique = [...new Set(dateArray)];
            //create array of minuti sum for each date
            const minutiArray = [];
            dateArrayUnique.forEach((date) => {
                let minuti = 0;
                sessions.forEach((sessione) => {
                    if(sessione.data == date){
                        minuti += sessione.minuti;
                    }
                });
                minutiArray.push(minuti);
            });
            res.status(200).json({ success: true, dateArrayUnique: dateArrayUnique, minutiArray: minutiArray });
        // } catch (error) {
        // console.error(`Errore durante la lettura delle sessioni: ${error.message}`);
        // res.status(500).json({ success: false, message: `L'operazione di lettura delle task non è andata a buon fine. ${error.message}` });
	    // }
});

module.exports = router;