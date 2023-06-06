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

const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');

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

router.post("/", (req, res) => {
    
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

router.post("/task", async (req, res) => {
    const { nome, dataScadenza, members, nomeGruppo, ID_gruppo } = req.body;

    if (!nome || !members || !nomeGruppo) {
        return res.status(400).json({ success: false, message: "Nome task, nome gruppo o membri mancanti" });
    }

    try {

        const subject = 'Nuova task assegnata';

        const templatePath = path.join(__dirname, '..', 'components', 'gestoreEmail', 'taskAssegnata.html');
        const htmlBody = fs.readFileSync(templatePath, 'utf8');

        const formattedHtmlBody = htmlBody
            .replace('{{taskName}}', nome)
            .replace('{{deadline}}', dataScadenza)
            .replace('{{groupName}}', nomeGruppo);
        
        const tasks = await Promise.all(members.map(async (member) => {
            const nuovaTask = new Task(member.id, nome, dataScadenza);
            nuovaTask.ID_gruppo = ID_gruppo;

            const task = await nuovaTask.crea();

            return task;
        }));
        const recipients = members.map((member) => member.email);
        await gestoreEmail(recipients, subject, formattedHtmlBody);

        res.status(201).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task di gruppo. Errore: ${error.message}` });
    }
});


router.put("/", (req, res) => {
    
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

router.delete("/:idGruppo", async (req, res) => {

    try {

        // controllo che ci sia l'id del gruppo e l'id dell'utente
        if (req.params.idGruppo == undefined || req.id == undefined) {
            return res.status(400).json({success: "false", message: `Errore, parametri assenti o non validi`})
        }

        // controllo che l'id del gruppo sia un ObjectId
        if (!GestoreDB.checkIfObjectId(req.params.idGruppo)) {
            return res.status(400).json({success: "false", message: `Errore, formato del codice non valido`})
        }

        // controllo sull'esistenza del gruppo
        const esistenzaGruppo = await GestoreDB.controllaEsistenzaGruppo(req.params.idGruppo)
        if (esistenzaGruppo) {
        }else {
            return res.status(404).json({ success: false, message: `Il gruppo specificato non esiste!` });
        }

        // ricerca del leader del gruppo (ID) e verifica che sia l'utente che ha richiesto l'eliminazione
        let leader = await GestoreDB.getLeaderIDfromGroupID(req.params.idGruppo)
        if (leader){
            
            leader = leader.toString();
            const utente_id = req.id

            if (leader === utente_id){
            } else {
                return res.status(403).json({success: "false", message: `L'utente che ha richiesto l'eliminazione del gruppo non è il leader!`})
            }
        }

        // elimino il gruppo
        await GestoreDB.eliminaGruppo(req.params.idGruppo)
        return res.status(200).json({success: "true", message: "Gruppo eliminato correttamente"})

    } catch (error) {
        res.status(500).json({ success: false, message: `Errore durante l'eliminazione del gruppo: ${error}` });
    }
})

router.delete("/:idGruppo/membro/:idMembro", async (req, res) => {

    console.log("SONO DENTRO RIMOZIONE MEMBRO DA GRUPPO")

    try {

        // 400 Bad Request: La richiesta non è valida o mancano parametri necessari. Ad esempio, potrebbe mancare l'ID del gruppo da eliminare.
        // controllo che ci sia l'id del gruppo e l'id dell'utente
        if (req.params.idGruppo == undefined || req.params.idMembro == undefined || req.id == undefined) {
            return res.status(400).json({success: "false", message: `Errore, parametri assenti o non validi`})
        }
        // controllo che l'id del gruppo sia un ObjectId
        if (!GestoreDB.checkIfObjectId(req.params.idGruppo) || !GestoreDB.checkIfObjectId(req.params.idMembro)) {
            return res.status(400).json({success: "false", message: `Errore, formato del codice o del membro non valido`})
        }

        // 404 Not Found: Il gruppo specificato non è stato trovato. Potrebbe non esistere o essere già stato eliminato in precedenza.
        // controllo sull'esistenza del gruppo
        const esistenzaGruppo = await GestoreDB.controllaEsistenzaGruppo(req.params.idGruppo);
        if (!esistenzaGruppo) {
            return res.status(404).json({ success: false, message: `Il gruppo specificato non esiste!` });
        }
        // controllo che il membro faccia parte del gruppo
        const esistenzaMembro = await GestoreDB.controllaMembroInGruppo(req.params.idMembro, req.params.idGruppo);
        if (!esistenzaMembro) {
            return res.status(404).json({ success: false, message: `Il membro specificato non esiste o non è membro del gruppo indicato!` });
        }

        // 403 Forbidden: L'utente è autenticato, ma non ha i privilegi necessari per eliminare il gruppo.
        // ricerca del leader del gruppo (ID) e verifica che sia l'utente che ha richiesto l'eliminazione
        let leader = await GestoreDB.getLeaderIDfromGroupID(req.params.idGruppo)
        if (leader){
            leader = leader.toString();
            const utente_id = req.id
            if (leader !== utente_id){
                return res.status(403).json({success: "false", message: `L'utente che ha richiesto la rimozione del membro non è il leader!`})
            }
        }

        // rimuovo il membro dal gruppo
        await GestoreDB.rimuoviMembroDaGruppo(req.params.idMembro, req.params.idGruppo)
        return res.status(204).end()

    } catch (error) {
        res.status(500).json({ success: false, message: `Errore durante l'eliminazione del gruppo: ${error}` });
    }
})

router.delete("/:idGruppo/abbandono", async (req, res) => {
    try {

        // 400 Bad Request: La richiesta non è valida o mancano parametri necessari. Ad esempio, potrebbe mancare l'ID del gruppo da eliminare.
        // controllo che ci sia l'id del gruppo e l'id dell'utente
        if (req.params.idGruppo == undefined || req.id == undefined) {
            return res.status(400).json({success: "false", message: `Errore, parametri assenti o non validi`})
        }
        // controllo che l'id del gruppo sia un ObjectId
        if (!GestoreDB.checkIfObjectId(req.params.idGruppo)) {
            return res.status(400).json({success: "false", message: `Errore, formato del codice non valido`})
        }

        // 404 Not Found: Il gruppo specificato non è stato trovato. Potrebbe non esistere o essere già stato eliminato in precedenza.
        // controllo sull'esistenza del gruppo
        const esistenzaGruppo = await GestoreDB.controllaEsistenzaGruppo(req.params.idGruppo);
        if (!esistenzaGruppo) {
            return res.status(404).json({ success: false, message: `Il gruppo specificato non esiste!` });
        }
        // controllo che il membro faccia parte del gruppo
        const esistenzaMembro = await GestoreDB.controllaMembroInGruppo(req.id, req.params.idGruppo);
        if (!esistenzaMembro) {
            return res.status(404).json({ success: false, message: `Il membro specificato non esiste o non è membro del gruppo indicato!` });
        }

        // 403 Forbidden: L'utente è autenticato, ma non ha i privilegi necessari per eliminare il gruppo.
        // ricerca del leader del gruppo (ID) e verifica che sia l'utente che ha richiesto l'eliminazione
        let leader = await GestoreDB.getLeaderIDfromGroupID(req.params.idGruppo)
        if (leader){
            leader = leader.toString();
            const utente_id = req.id
            if (leader === utente_id){
                return res.status(403).json({success: "false", message: `L'utente che ha richiesto l'abbandono è leader!`})
            }
        }

        // rimuovo il membro dal gruppo
        await GestoreDB.rimuoviMembroDaGruppo(req.id, req.params.idGruppo)
        return res.status(204).end()

    } catch (error) {
        res.status(500).json({ success: false, message: `Errore durante l'abbandono: ${error}` });
    }
})

router.put("/:idGruppo/:idMembro", async (req, res) => {
    try {

        // 400 Bad Request: La richiesta non è valida o mancano parametri necessari. Ad esempio, potrebbe mancare l'ID del gruppo da eliminare.
        // controllo che ci sia l'id del gruppo e l'id dell'utente
        if (req.params.idGruppo == undefined || req.params.idMembro == undefined || req.id == undefined) {
            return res.status(400).json({success: "false", message: `Errore, parametri assenti o non validi`})
        }
        // controllo che l'id del gruppo sia un ObjectId
        if (!GestoreDB.checkIfObjectId(req.params.idGruppo) || !GestoreDB.checkIfObjectId(req.params.idMembro)) {
            return res.status(400).json({success: "false", message: `Errore, formato del codice o del membro non valido`})
        }

        // 404 Not Found: Il gruppo specificato non è stato trovato. Potrebbe non esistere o essere già stato eliminato in precedenza.
        // controllo sull'esistenza del gruppo
        const esistenzaGruppo = await GestoreDB.controllaEsistenzaGruppo(req.params.idGruppo);
        if (!esistenzaGruppo) {
            return res.status(404).json({ success: false, message: `Il gruppo specificato non esiste!` });
        }
        // controllo che il membro faccia parte del gruppo
        const esistenzaMembro = await GestoreDB.controllaMembroInGruppo(req.params.idMembro, req.params.idGruppo);
        if (!esistenzaMembro) {
            return res.status(404).json({ success: false, message: `Il membro specificato non esiste o non è membro del gruppo indicato!` });
        }

        // 403 Forbidden: L'utente è autenticato, ma non ha i privilegi necessari per eliminare il gruppo.
        // ricerca del leader del gruppo (ID) e verifica che sia l'utente che ha richiesto l'eliminazione
        let leader = await GestoreDB.getLeaderIDfromGroupID(req.params.idGruppo)
        if (leader){
            leader = leader.toString();
            const utente_id = req.id
            if (leader !== utente_id){
                return res.status(403).json({success: "false", message: `L'utente che ha richiesto la rimozione del membro non è il leader!`})
            }
        }

        // elimino il gruppo
        await GestoreDB.rimuoviMembroDaGruppo(req.params.idMembro, req.params.idGruppo)
        return res.status(204).end()

    } catch (error) {
        res.status(500).json({ success: false, message: `Errore durante l'eliminazione del gruppo: ${error}` });
    }
})



module.exports = router