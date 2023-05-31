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

                                // const updatedMembers = element.members_id.map((membro_id, index) => {
                                //     return GestoreDB.getDataFromID(membro_id)
                                //       .then((result) => {
                                //         return [membro_id, result.username]; // Restituisce la coppia di ID e username
                                //       })
                                //       .catch((error) => {
                                //         throw error;
                                //       });
                                //   });
                                  
                                //   Promise.all(updatedMembers)
                                //     .then((updatedResults) => {

                                        finalResult.push({
                                            _id: element._id,
                                            name: element.name,
                                            leader_id: element.leader_id,
                                            leader_username: leaderUsername,
                                            members: element.members_id
                                        })

                                    // })
                                        // .catch((error) => {
                                        // console.error(error);
                                        // });

                                

                                //console.log(Array.from(element.members_id))

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
                    res.status(204).end();
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