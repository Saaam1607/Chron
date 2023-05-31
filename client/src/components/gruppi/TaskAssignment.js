import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function TaskAssignment({ selectedMembers, groupName, onClose }) {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleTaskAssignment = async () => {
        try {
        console.log("Selected members: ", selectedMembers);
        const requestBody = {
            nome: taskName,
            dataScadenza: deadline,
            ID_utenti: selectedMembers,
            ID_gruppo: groupName
        };

        const response = await fetch('/assegnaTask', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Task assegnata con successo:', data);
            // Esegui altre azioni di successo o aggiorna lo stato della tua applicazione
            onClose(); // Chiudi il modal dopo aver assegnato la task
        } else {
            const error = await response.json();
            console.error('Errore nell\'assegnazione della task:', error.message);
            // Gestisci l'errore come preferisci
        }
        } catch (error) {
        console.error('Si è verificato un errore durante l\'assegnazione della task:', error);
        // Gestisci l'errore come preferisci
        }
    };

    return (
        <div>
            <Form.Group controlId="formTaskName">
                <Form.Label>Nome Task</Form.Label>
                <Form.Control type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDeadline">
                <Form.Label>Data Scadenza</Form.Label>
                <Form.Control type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </Form.Group>

            <Button variant="primary" className="add-button" onClick={handleTaskAssignment}>
                Assegna Task
            </Button>
            
        </div>
    );
}
