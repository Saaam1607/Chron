const express = require("express")
const router = express.Router()
const ListaTasks = require('../components/to-do/listaTasks');
const Task = require('../components/to-do/task');

let isFirstTime = true;
const listaTask = new ListaTasks(1);


router.get('/', async (req, res) => {
	console.log("GET /todos");

    if(isFirstTime && req.id){
        listaTask.ID_utente = req.id;
        isFirstTime = false;
    }
    
	try {
        const todos = await listaTask.leggiTasks();

        if(todos.length == 0){
            res.status(204).json({ success: true, message: "Non ci sono task da mostrare" });
        }else{
            res.status(200).json({ success: true, tasks: todos });
        }
	} catch (error) {
        console.error(`Errore durante la lettura delle tasks: ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di lettura delle task non è andata a buon fine. ${error.message}` });
	}
});

router.post('/new', async (req, res) => {
	console.log("POST /todo/new");
	const { nome, dataScadenza } = req.body;
  
	if (!nome ) {
        res.status(400).json({ success: false, message: "Nome mancante" }); 
        return;
	}
  
	const nuovaTask = new Task(listaTask.ID_utente, nome, dataScadenza);
  
	try {
	  	const task  = await nuovaTask.crea();
		nuovaTask._id = task._id;
		nuovaTask.contrassegna = task.contrassegna;
		nuovaTask.gruppoID = task.gruppoID;
		listaTask.tasks.push(nuovaTask);

		res.status(201).json({success: true, task:task}); 
	} catch (error) {
        console.error(`Errore durante la creazione della task: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task. Errore: ${error.message}` });
	}
});

router.put('/complete', async (req, res) => {
    console.log("PUT /complete");
    const id = req.body.id;
    const task = listaTask.tasks.find((task) => task._id == id);

    if (task) {
        try {
            await task.contrassegnaTask();
            res.status(200).json({ success: true, result: task });
        } catch (error) {
            console.error(`Errore durante la contrassegnazione della task: ${error.message}`);
            res.status(500).json({ success: false, message: `Si è verificato un errore durante l'operazione. Messaggio: ` + error.message });
        }
    } else {
        res.status(404).json({ success: false, message: `Task con id ${id} non trovata` });
    }
});

router.delete('/delete', async (req, res) => {
    console.log("DELETE /delete");
    const id = req.body.id;
    const task = listaTask.tasks.find((task) => task._id == id);
    if (task) {
        await task.elimina();
        res.status(200).json({ success: true, result: task });
    } else {
        res.status(404).json({ success: false, message: `Task con id ${id} non trovata` });
    }
});

module.exports = router