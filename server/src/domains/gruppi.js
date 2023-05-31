require('dotenv').config();

const express = require("express")
const router = express.Router()
const path = require('path');
const fs = require('fs');
const GestoreDB = require("../components/gestoreDB/gestoreDB")
const gestoreEmail = require("../components/gestoreEmail/gestoreEmail");
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
                                element.membersData = [];

                                const nestedPromises = element.members_id.map((membro_id, index) => {

                                    return GestoreDB.getDataFromID(membro_id)
                                        .then((result) => {
                                            element.membersData.push([membro_id, result.username, result.email]);
                                        })
                                            .catch((error) => {
                                                throw error;
                                            });    
                                })

                                return Promise.all(nestedPromises)
                                    .then(() => {

                                        finalResult.push({
                                            _id: element._id,
                                            name: element.name,
                                            leader_id: element.leader_id,
                                            leader_username: leaderUsername,
                                            members: element.members_id,
                                            membersData: [element.membersData]
                                        })

                                    })

                            })
                                .catch((error) => {
                                    throw error;
                                });
                    });

                    Promise.all(promises)
                        .then(() => {
                            return res.status(200).json({success: "true", result: finalResult})
                        })
                            .catch((error) => {
                                return res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                            });
                } else {
                    return res.status(204).end();
                }
        })
            .catch((error) => {
                return res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
            });

    } catch (error) {
        return res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
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
                            element.membersData = [];

                            const nestedPromises = element.members_id.map((membro_id, index) => {

                                return GestoreDB.getDataFromID(membro_id)
                                    .then((result) => {
                                        element.membersData.push([membro_id, result.username, result.email]);
                                    })
                                        .catch((error) => {
                                            throw error;
                                        });    
                            })

                            return Promise.all(nestedPromises)
                                .then(() => {

                                    finalResult.push({
                                        _id: element._id,
                                        name: element.name,
                                        leader_id: element.leader_id,
                                        leader_username: leaderUsername,
                                        members: element.members_id,
                                        membersData: [element.membersData]
                                    })

                                })

                        })
                            .catch((error) => {
                                throw error;
                            });
                });

                Promise.all(promises)
                    .then(() => {

                        return res.status(200).json({success: "true", result: finalResult})
                    })
                        .catch((error) => {
                            return res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                        });
            } else {
                return res.status(204).end();
            }
    })
        .catch((error) => {
            return res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
        });
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
    }
})

router.post("/nuovoGruppo", (req, res) => {
    
    if (req.body.name == undefined || req.body.name == "" || req.id == undefined) {
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
    const { nome, dataScadenza, members, nomeGruppo } = req.body;
  
	if (!nome || !members || !nomeGruppo) {
        res.status(400).json({ success: false, message: "Nome task, nome gruppo o membri mancanti" }); 
        return;
	}
  
	try {
        const ID_utenti = members.map((member) => member.id);

        const nuovaTask = new Task(ID_utenti, nome, dataScadenza);
        nuovaTask.gruppoID = nomeGruppo;
        
	  	const task  = await nuovaTask.crea();

        const recipient = members.map((member) => member.email); 
        const subject = 'Nuova task assegnata';

        const templatePath = path.join(__dirname, '..', 'components', 'gestoreEmail', 'taskAssegnata.html');
        const htmlBody = fs.readFileSync(templatePath, 'utf8');

        const formattedHtmlBody = htmlBody
          .replace('{{taskName}}', nome)
          .replace('{{deadline}}', dataScadenza)
          .replace('{{groupName}}', nomeGruppo);
    
        // Invia l'email di notifica
        await gestoreEmail(recipient, subject, formattedHtmlBody);

		res.status(201).json({success: true, task:task}); 

	} catch (error) {
        //console.error(`Errore durante la creazione della task di gruppo: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task di gruppo. Errore: ${error.message}` });
	}
});


router.put("/nuovoGruppo", (req, res) => {
    
    if (req.body.codice == undefined || req.id == undefined) {
        return res.status(400).json({success: "false", message: `Errore, parametri assenti o non validi`})
    }

    if (!GestoreDB.checkIfObjectId(req.body.codice)) {
        return res.status(400).json({success: "false", message: `Errore, formato del codice non valido`})
    }

    try{
        GestoreDB.uniscitiGruppo(req.body.codice, req.id)
            .then(() => {
                res.status(201).json({success: "true"})
            })
                .catch((error) => {
                    switch (error.stato) {
                        case 404:
                            res.status(404).json({success: "false", message: `Il gruppo non esiste!`})
                            break;
                        case 409:
                            res.status(409).json({success: "false", message: `Sei già un componente di questo gruppo!`})
                            break;
                        default:
                            res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
                    }
                    
                })
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
    }

})

router.get("/username", (req, res) => {
    if (req.query.id == undefined) {
        res.status(400).json({success: "false", message: "Errore, ID non trovato"})
    } else {
        GestoreDB.getDataFromID(req.query.id)
            .then((esito) => {
                res.status(200).json(esito.username)
            })
                .catch((error) => {
                    res.status(500).json({success: "false", message: `Errore durante la lettura dei dati: ${error}`})
                });
    }
})



module.exports = router