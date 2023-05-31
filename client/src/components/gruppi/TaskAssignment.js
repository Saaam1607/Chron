import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import CookieManager from'../tokenManager/cookieManager';


export default function TaskAssignment({ selectedMembers, groupName, onClose }) {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleTaskAssignment = async () => {
        try {
        console.log("Selected members: ", selectedMembers);
        const requestBody = {
            nome: taskName,
            dataScadenza: deadline,
            members: selectedMembers,
            nomeGruppo: groupName
        };

        const response = await fetch('api/v1/gruppi/assegnaTask', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Task assegnata con successo:', data);
            onClose(); 
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
        } catch (error) {
            console.error('Si è verificato un errore durante l\'assegnazione della task:', error);
            alert(error);
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
