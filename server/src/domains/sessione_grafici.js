const express = require("express")
const router = express.Router()
const ListaSessioni = require("../components/chron/Chron.js")

let isFirstTime = true;
const listaSessioni = new ListaSessioni(1);


router.get('/', async (req, res) => {

     if(isFirstTime && req.id){
         isFirstTime = false;
         listaSessioni.ID_utente = req.id;
     }
    
	try {
            //fetch data from listaSessioni
            const sessions = await listaSessioni.leggiStorico(req.query.arrowClick, req.query.isMonth);
            //console.log(sessions);
            if(sessions.length == 0){
                res.status(204).json({ success: true, message: "Non ci sono sessioni da mostrare" });
            }else{
                res.status(200).json({ success: true, sessions: sessions});  
            }
            
        } catch (error) {
        console.error(`Errore durante la lettura delle sessioni: ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di lettura delle sessioni non è andata a buon fine. ${error.message}` });
	    }
});

module.exports = router;