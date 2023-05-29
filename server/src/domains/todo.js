const express = require("express")
const router = express.Router()
const ListaTasks = require('../components/to-do/listaTasks');
const Task = require('../components/to-do/task');

router.get('/', async (req, res) => {
    console.log("GET /todo");
    const listaTask = new ListaTasks(req.id);

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
  
	if (!nome) {
        res.status(400).json({ success: false, message: "Nome mancante" }); 
        return;
	}
  
	const nuovaTask = new Task(req.id, nome, dataScadenza);
  
	try {
	  	const task  = await nuovaTask.crea();
		nuovaTask._id = task._id;
		nuovaTask.contrassegna = task.contrassegna;
		nuovaTask.gruppoID = task.gruppoID;

		res.status(201).json({success: true, task:task}); 

	} catch (error) {
        console.error(`Errore durante la creazione della task: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task. Errore: ${error.message}` });
	}
});

router.put('/complete', async (req, res) => {
    console.log("PUT /complete");
    const idTask = req.body.id;
    let listaTask = new ListaTasks(req.id);

    if (!idTask) {
        res.status(400).json({ success: false, message: "id Task mancante" }); 
        return;
	}
    
    try {
        listaTask.tasks = await listaTask.leggiTasks();
        const task = listaTask.tasks.find((task) => task._id == idTask);
  
        if (task) {
            await task.contrassegnaTask();
            res.status(200).json({ success: true, result: task });
        } else {
            res.status(404).json({ success: false, message: `Task con id ${idTask} non trovata` });
        }
    } catch (error) {
        console.error(`Errore durante la lettura delle task: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante l'operazione. Messaggio: ` + error.message });
    }

});

router.delete('/delete', async (req, res) => {
    console.log("DELETE /delete");
    const idTask = req.body.id;
    let listaTask = new ListaTasks(req.id);

    if (!idTask) {
        res.status(400).json({ success: false, message: "id Task mancante" }); 
        return;
	}

    try {
        listaTask.tasks = await listaTask.leggiTasks();
        const task = listaTask.tasks.find((task) => task._id == idTask);
  
        if (task) {
            await task.elimina();
            res.status(200).json({ success: true, result: task });
        } else {
            res.status(404).json({ success: false, message: `Task con id ${idTask} non trovata` });
        }
    } catch (error) {
        console.error(`Errore durante la lettura delle task: ${error.message}`);
        res.status(500).json({ success: false, message: `Si è verificato un errore durante l'operazione. Messaggio: ` + error.message });
    }

});

router.get('/sort', async (req, res) => {
    console.log("GET /sort");
    const listaTask = new ListaTasks(req.id);

    await listaTask.leggiTasks();
    const sort = req.query.sort;

    if(sort == "name"){
        listaTask.ordinaPerNome();
    }else if(sort == "date"){
        listaTask.ordinaPerDataScadenza();
    }else if(sort == "group"){
        listaTask.ordinaPerGruppo();
    res.status(200).json({ success: true, tasks: listaTask.tasks });
    }


});

module.exports = router