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
            return res.status(204).end();
        } else {
            // filtro la lista di task per restituire solo i campi necessari
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
        console.error(`L'operazione di lettura delle task non è andata a buon fine. ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di lettura delle task non è andata a buon fine. ${error.message}` });
    }
});

router.post('/', async (req, res) => {
	console.log("POST /todo/");
	const { nome, dataScadenza } = req.body;
  
	if (!nome) {
        return res.status(400).json({ success: false, message: `Il parametro "nome" mancante.` }); 
	}
    
	try {

        const nuovaTask = new Task(req.id, nome, dataScadenza);

	  	const task  = await nuovaTask.crea();
		res.status(201).json({success: true, task:task}); 

	} catch (error) {
        console.error(`L'operazione di creazione della task non è andata a buon fine. ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di creazione della task non è andata a buon fine. ${error.message}` });
	}
});

router.put('/', async (req, res) => {
    console.log("PUT /");
    const idTask = req.body.id;
    let listaTask = new ListaTasks(req.id);

    if (!idTask) {
        return res.status(400).json({ success: false, message: `Il parametro "idTask" mancante.` }); 
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
        console.error(`L'operazione di aggiornamento della task non è andata a buon fine. ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di aggiornamento della task non è andata a buon fine. ${error.message} ` });
    }

});

router.delete('/', async (req, res) => {
    console.log("DELETE /");
    const idTask = req.body.id;
    let listaTask = new ListaTasks(req.id);

    if (!idTask) {
        return res.status(400).json({ success: false, message: `Il parametro "idTask" mancante.` }); 
	}

    try {

        listaTask.tasks = await listaTask.leggiTasks();
        const task = listaTask.tasks.find((task) => task._id == idTask);
  
        if (task) {
            await task.elimina();
            res.status(200).json({ success: true, result: task });
        } else {
            res.status(404).json({ success: false, message: `La task con id ${idTask} non trovata.` });
        }

    } catch (error) {
        console.error(`L'operazione di rimozione della task non è andata a buon fine. ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di rimozione della task non è andata a buon fine. ${error.message}`});
    }

});

router.get('/ordinata/:sort', async (req, res) => {
    console.log("GET /ordinata");
    const listaTask = new ListaTasks(req.id);

    try {

        await listaTask.leggiTasks();
        const { sort } = req.params;

        if(listaTask.tasks.length == 0) {
            return res.status(204).end();
        } else {

            switch (sort) {
                case "name":
                  listaTask.ordinaPerNome();
                  break;
                case "date":
                  listaTask.ordinaPerDataScadenza();
                  break;
                case "group":
                  listaTask.ordinaPerGruppo();
                  break;
                default:
                  return res.status(400).json({ success: false, message: `Parametro di ordinamento non valido. Utilizzare "name", "date" o "group".` });
              }

            res.status(200).json({ success: true, tasks: listaTask.tasks });
        }

    }
    catch (error) {
        console.error(`L'operazione di ordinamento delle task non è andata a buon fine. ${error.message}`);
        res.status(500).json({ success: false, message: `L'operazione di ordinamento delle task non è andata a buon fine. ${error.message}` });
    }
});

module.exports = router