import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { handleAlert, handleConfirmation } from "../alert/Alert";

import jwtDecode from 'jwt-decode';
import CookieManager from'../tokenManager/cookieManager';


export default function AcceptRejectTaskForm() {
    const { token } = useParams();
    const [taskAccepted, setTaskAccepted] = useState(false);
    const [taskRejected, setTaskRejected] = useState(false);
    const [taskData, setTaskData] = useState(null);

    const decodeToken = () => {
        const decodedToken = jwtDecode(token);
        const taskData = {
            taskId: decodedToken.taskId,
            taskName: decodedToken.taskName,
            deadline: decodedToken.deadline,
            memberID: decodedToken.memberID,
            groupName: decodedToken.groupName,
            groupID: decodedToken.groupID,
        };
        setTaskData(taskData);
    };

    const handleAcceptTask = () => {

        // Invia la scelta al backend
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
                },
            body: JSON.stringify({ _id: taskData.nome, nome: taskData.taskName, dataScadenza: taskData.deadline, ID_utente: taskData.memberID, ID_gruppo: taskData.groupID})
        };

        fetch('/api/v1/todos/new', requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); // Converti la risposta in formato JSON se la richiesta ha successo
            } else {
                throw new Error('Errore nella richiesta'); // Lanciare un'eccezione in caso di errore nella risposta
            }
        })
        .then(data => {
            // Gestisci la risposta del backend
            console.log(data); // Puoi visualizzare la risposta nella console per debug
            // Esegui le azioni necessarie per visualizzare la conferma con SweetAlert
            handleAlert('Task accettata con successo', false, 'success');
            setTaskAccepted(true);
        })
        .catch(error => {
            // Gestisci eventuali errori di rete o del server
            console.error(error);
            // Esegui le azioni necessarie per visualizzare l'errore con SweetAlert
            handleAlert('Si è verificato un errore', false, 'error');
        });
    };

    const handleRejectTask = () => {
        handleConfirmation(
        'Sei sicuro di voler rifiutare la task?',
        'Rifiuta',
        'Annulla',
        handleTaskRejection
        );
    };

    const handleTaskRejection = () => {
        // Esegui azioni per rifiutare la task
        setTaskRejected(true);
        handleAlert('Task rifiutata con successo', false, 'success');

        // Invia la scelta al backend
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, choice: 'reject' })
        };

        fetch('/api/v1/todos/new', requestOptions)
        .then(response => {
            // Gestisci la risposta del backend
        })
        .catch(error => {
            // Gestisci eventuali errori di rete o del server
        });
    };

    if (!taskData) {
        decodeToken(); // Decodifica il token e imposta i dati della task
        return <div>Loading...</div>;
    }

    return (
        <div className="col-md-4">
        <div className="card-body">
            <div className="accept-reject-task-form">
            {taskAccepted ? (
                <>
                <h2>Task accettata con successo</h2>
                <p>Ora puoi iniziare a lavorare sulla task assegnata.</p>
                </>
            ) : taskRejected ? (
                <>
                <h2>Task rifiutata</h2>
                <p>La task è stata rifiutata con successo.</p>
                </>
            ) : (
                <div>
                <h2>Accetta o rifiuta la task</h2>
                <p>Nome Task: {taskData.taskName}</p>
                <p>Scadenza: {taskData.deadline}</p>
                <p>Nome Gruppo: {taskData.groupName}</p>
                <Button variant="primary" onClick={handleAcceptTask}>
                    Accetta Task
                </Button>{" "}
                <Button variant="danger" onClick={handleRejectTask}>
                    Rifiuta Task
                </Button>
                </div>
            )}
            </div>
        </div>
        </div>
    );
}



