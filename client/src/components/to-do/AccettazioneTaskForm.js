import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { handleAlert, handleConfirmation } from "../alert/Alert";

import CookieManager from'../tokenManager/cookieManager';


export default function AcceptRejectTaskForm() {
    const { token } = useParams();
    const [taskAccepted, setTaskAccepted] = useState(false);
    const [taskRejected, setTaskRejected] = useState(false);
    const [taskData, setTaskData] = useState(null);
  
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
                    },
                };
                const response = await fetch(`/api/v1/gruppi/verificaToken/${token}`, requestOptions);
                const data = await response.json();
            if (response.ok) {
                setTaskData(data.result);
                console.log(data.result);
            } else {
                handleAlert(data.message, false, "error");
            }
            } catch (error) {
                handleAlert("Si è verificato un errore", false, "error");
            }
      };
  
      verifyToken();
    }, [token]);

    const handleAcceptTask = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
            },
            body: JSON.stringify({ token: token})
        };

        fetch('/api/v1/gruppi/acceptTask', requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                return response.json().then(data => {
                    throw new Error(data.message); 
                });
            }
        })
        .then(data => {
            handleAlert('Task accettata con successo', false, 'success');
            setTaskAccepted(true);
        })
        .catch(error => {
            console.error(error);
            handleAlert(error.message, false, 'error');
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
        const requestOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
            },
            body: JSON.stringify({ token: token})
        };

        fetch('/api/v1/gruppi/rejectTask', requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                return response.json().then(data => {
                    throw new Error(data.message); 
                });
            }
        }).then(data => {
            setTaskRejected(true);
            handleAlert('Task rifiutata con successo', false, 'success');
        })
        .catch(error => {
            console.error(error);
            handleAlert(error.message, false, 'error');
        });
    };

    if (!taskData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="col-md-12">
                <div className="card-body">
                    <h1>Form di decisione</h1>

                    <div className="accept-reject-task-form col-md-6">
                    {taskAccepted ? (
                        <>
                            <div className="reset-password">
                                <div className="reset-password-form">
                                    <h2>Task accettata con successo</h2>
                                    <br></br>
                                    <p>Ora puoi iniziare a lavorare sulla task assegnata.</p>
                                    <a href="/to-do">Vai alla lista delle task</a>
                                </div>
                            </div>
                        </>
                    ) : taskRejected ? (
                        <>
                            <div className="reset-password">
                                <div className="reset-password-form">
                                    <h2>Task rifiutata</h2>
                                    <br></br>
                                    <p>La task è stata rifiutata con successo.</p>
                                    <a href="/to-do">Vai alla lista delle task</a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="reset-password">
                            <form className='reset-password-form'>
                                <h2>Accetta o rifiuta la task</h2>
                                <br></br>
                                <p><strong>Nome Task:</strong> {taskData.taskName}</p>
                                <p><strong>Scadenza:</strong> {taskData.deadline}</p>
                                <p><strong>Nome Gruppo:</strong> {taskData.groupName}</p>
                                <br></br>
                                <Button variant="primary" className="add-button"  onClick={handleAcceptTask} disabled={taskAccepted}>
                                    Accetta Task
                                </Button>{" "}
                                <Button variant="danger" style={{ width: "auto" }} onClick={handleRejectTask} disabled={taskRejected}>
                                    Rifiuta Task
                                </Button>
                            </form>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>

    );
}



