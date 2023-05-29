require('dotenv').config();

const express = require("express")
const router = express.Router()
const GestoreDB = require("../components/gestoreDB/gestoreDB")

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


router.put("/nuovoGruppo", (req, res) => {
    
    if (req.body.codice == undefined || req.id == undefined) {
        return res.status(400).json({success: "false", message: `Errore, Parametri ricevuti non validi: ${error}`})
    }

    try{
        GestoreDB.uniscitiGruppo(req.body.codice, req.id)
            .then((result) => {
                console.log(result)
                res.status(201).json({success: "true"})
            })
                .catch((error) => {
                    switch (error.stato) {
                        case 404:
                            res.status(404).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
                            break;
                        case 409:
                            res.status(409).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
                            break;
                        default:
                            res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
                    }
                    
                })
    } catch (error) {
        res.status(500).json({success: "false", message: `Errore durante la creazione del gruppo: ${error}`})
    }

})



module.exports = router