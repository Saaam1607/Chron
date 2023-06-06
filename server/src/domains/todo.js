const express = require("express")
const router = express.Router()
const ListaTasks = require('../components/to-do/listaTasks');
const Task = require('../components/to-do/task');

router.get('/', async (req, res) => {
    console.log("GET /todo");
    const listaTask = new ListaTasks(req.id);

    try {
        const todos = await listaTask.leggiTasks();

        if (todos.length == 0) {
            res.status(204).end();
        } else {
            // Restituisci un nuovo array di oggetti filtrati
            todos.map(task => ({
                _id: task._id,
                nome: task.nome,
                dataScadenza: task.dataScadenza,
                contrassegna: task.contrassegna,
                nomeGruppo: task.nomeGruppo,
            }));

            res.status(200).json({ success: true, tasks: todos });
        }
    } catch (error) {
        console.error(`Errore durante la lettura delle tasks: ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di lettura delle task non è andata a buon fine. ${error.message}` });
    }
});

router.post('/', async (req, res) => {
	console.log("POST /todo/");
    const { _id, ID_utente, nome, dataScadenza, ID_gruppo } = req.body;
  
	if (!nome) {
        res.status(400).json({ success: false, message: "Nome mancante" }); 
        return;
	}

    let nuovaTask;
    
    // Se non è presente l'id, la task è personale
    if(_id == null){
        nuovaTask = new Task(req.id, nome, dataScadenza);
    }else{
        nuovaTask = new Task(ID_utente, nome, dataScadenza);
        nuovaTask._id = _id;
        nuovaTask.ID_gruppo = ID_gruppo;
    }
  
	try {
	  	const task  = await nuovaTask.crea();

		res.status(201).json({success: true, task:task}); 

	} catch (error) {
        if(error.message.includes("esistente")) {
            res.status(409).json({ success: false, message: `Task già accettata` });
        }
        else {
            console.error(`Errore durante la creazione della task: ${error.message}`);
            res.status(500).json({ success: false, message: `Si è verificato un errore durante la creazione della task. Errore: ${error.message}` });
        }

	}
});

router.put('/', async (req, res) => {
    console.log("PUT /");
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

router.delete('/', async (req, res) => {
    console.log("DELETE /");
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

router.get('/ordinata', async (req, res) => {
    console.log("GET /ordinata");
    const listaTask = new ListaTasks(req.id);

    try {
        await listaTask.leggiTasks();
        const sort = req.query.sort;

        if(listaTask.tasks.length == 0){
            res.status(204).end();
        }else{
            if(sort == "name"){
                listaTask.ordinaPerNome();
            }else if(sort == "date"){
                listaTask.ordinaPerDataScadenza();
            }else if(sort == "group"){
                listaTask.ordinaPerGruppo();
            }else{
                res.status(400).json({ success: false, message: "Sort non valido" });
                return;
            }
            res.status(200).json({ success: true, tasks: listaTask.tasks });
        }
    }
    catch (error) {
        console.error(`Errore durante la lettura delle tasks: ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di ordinamento delle task non è andata a buon fine. ${error.message}` });
    }
});

module.exports = router