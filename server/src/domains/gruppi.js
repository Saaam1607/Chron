require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")
const Task = require('../components/to-do/task');

var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

const jwt = require("jsonwebtoken")

router.get("/membro", bodyParser.json(), (req, res) => {
    try{
        GestoreDB.ottieniGruppiMembro(req.id)
            .then((results) => {
                if (results.length > 0) {

                    let finalResult = []

                    const promises = results.map((element) => {
                        return GestoreDB.getDataFromID(element.leader_id)
                          .then((result) => {
                            
                            leaderUsername = result.username;

                            finalResult.push({
                                _id: element._id,
                                name: element.name,
                                leader_id: element.leader_id,
                                leader_username: leaderUsername,
                                members: Array.from(element.members_id)
                            })

                          })
                          .catch((error) => {
                            throw error;
                          });
                    });

                    Promise.all(promises)
                        .then(() => {
                            res.status(200).json({success: "true", result: finalResult})
                        })
                            .catch((error) => {
                                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                            });
                } else {
                    res.status(204)
                }
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
            });
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
    }
})



router.get("/leader", bodyParser.json(), (req, res) => {
    try{

        GestoreDB.ottieniGruppiLeader(req.id)
            .then((results) => {
                if (results.length > 0) {

                    let finalResult = []

                    const promises = results.map((element) => {
                        return GestoreDB.getDataFromID(element.leader_id)
                          .then((result) => {
                            
                            leaderUsername = result.username;

                            finalResult.push({
                                _id: element._id,
                                name: element.name,
                                leader_id: element.leader_id,
                                leader_username: leaderUsername,
                                members: Array.from(element.members_id)
                            })

                          })
                          .catch((error) => {
                            throw error;
                          });
                    });

                    Promise.all(promises)
                        .then(() => {
                            res.status(200).json({success: "true", result: finalResult})
                        })
                            .catch((error) => {
                                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                            });
                } else {
                    res.status(204)
                }
        })
            .catch((error) => {
                res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
            });
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
    }
})

router.post("/nuovoGruppo", (req, res) => {
    
    if (req.body.name == undefined || req.body.name == "") {
        return res.status(400).json({success: "false", message: `Errore, Parametri ricevuti non validi: ${error}`})
    }

    try{
        GestoreDB.creaGruppo(req.body.name, req.id)
            .then(() => {
                res.status(201).json({success: "true"})
            })
                .catch((error) => {
                    res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
                })
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
    }

})

router.post("/assegnaTask", async (req, res) => {
    const { nome, dataScadenza, ID_utenti, ID_gruppo } = req.body;
  
	if (!nome || !ID_utenti) {
        res.status(400).json({ success: false, message: "Nome mancante o partecipanti mancanti" }); 
        return;
	}
  
	try {
        const nuovaTask = new Task(ID_utenti, nome, dataScadenza);
        nuovaTask.gruppoID = ID_gruppo;
        
	  	const task  = await nuovaTask.crea();
		res.status(201).json({success: true, task:task}); 

	} catch (error) {
        console.error(`Errore durante la creazione della task di gruppo: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task di gruppo. Errore: ${error.message}` });
	}
});



module.exports = router