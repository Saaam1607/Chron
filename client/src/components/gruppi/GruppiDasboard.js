import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';
import Gruppo from './Gruppo';
import { handleAlert } from '../alert/Alert';


import 'bootstrap/dist/css/bootstrap.min.css';
import './Gruppi.css';
import { Button, Form, Modal } from "react-bootstrap";



export default function GruppiDashboard(){

    const [gruppiMembro, setGruppiMembro] = useState([]);
    const [gruppiLeader, setGruppiLeader] = useState([]);

    const [newGroupPopupActive, setNewGroupPopupActive] = useState(false);
    const [nomeGruppo, setNomeGruppo] = useState("");
    const [nuovoGruppo, setNuovoGruppo] = useState(null);

    const [addGroupPopupActive, setAddGroupPopupActive] = useState(false);
    const [codice, setCodice] = useState("");



    function getGruppiMembro(){

        fetch('api/v1/gruppi/membro', {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {

                if (response.status === 200) {

                    return response.json();
                } else if (response.status === 204){
                    return;
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                    .then(data => {

                        if (data){ // c'è qualche gruppo
                            if (Array.isArray(data.result) && data.result.length > 0){
                                setGruppiMembro(data.result);
                            }
                        } else { // non ci sono gruppi
                            setGruppiMembro([]);
                        }
                    })
                        .catch(error => {
                            alert(error.message);
                        })
    }

    function getGruppiLeader(){
        fetch('api/v1/gruppi/leader', {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {

                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 204){
                    return;
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(data => {

                    if (data){ // c'è qualche gruppo
                        if (Array.isArray(data.result) && data.result.length > 0){
                            setGruppiLeader(data.result);
                        }
                    } else { // non ci sono gruppi
                        setGruppiLeader([]);
                    }
                })
                        .catch(error => {
                            alert(error.message);
                        })
    }



    useEffect(() => {

        getGruppiMembro();
        getGruppiLeader();
        
    }, [nuovoGruppo]);



    function creaGruppo(){

        fetch('api/v1/gruppi/nuovoGruppo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({name: nomeGruppo})
        })
            .then(response => {
                if (response.ok) {
                    return
                } else if (response.status === 400){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else if (response.status === 401){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(() => {
                    setNuovoGruppo(nomeGruppo);
                    handleAlert("Creazione completata", false, "success");
                })
                    .catch(error => {
                        alert(error.message);
                    })
    }



    function uniscitiGruppo(codice){

        fetch('api/v1/gruppi/nuovoGruppo', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({codice: codice})
        })
            .then(response => {

                if (response.ok) {
                    return
                } else if (response.status === 400){
                    return response.json().then(errorData => {
                        throw ({status: 400, errorData: errorData.message});
                    });
                } else if (response.status === 404){
                    return response.json().then(errorData => {
                        throw ({status: 404, errorData: errorData.message});
                    });
                } else if (response.status === 409){
                    return response.json().then(errorData => {
                        throw ({status: 409, errorData: errorData.message});
                    });
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw ({status: 500, errorData: errorData.message});
                    });
                }
            })
                .then(() => {
                    setNuovoGruppo("NUOVO");
                    handleAlert("Unione completata", false, "success");
                })
                    .catch(error => {

                        let message = "Unione non riuscita";

                        if (error.status === 400){
                            message ="Formato del codice non valido";
                        }
                        else if (error.status === 404){
                            message = "Gruppo non trovato"
                        } else if (error.status === 409){
                            message ="Sei già componente di questo gruppo";
                        }
                        handleAlert(message, false, "error");
                    })

    }



    return (
        <div className='Gruppi'>
            
            <div className='gruppi-leader'>

                {gruppiLeader.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_username} isLeader={true} membersData={item.membersData}/>
                    </div>
                ))}

            </div>


            <div className='gruppi-membro'>

                {gruppiMembro.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_username} membersData={item.membersData}/>
                    </div>
                ))}

            </div>

            <div className="gruppi-bottoni-div">

                <div className='gruppi-bottone'>

                        <span className="icona-gruppo">
                            <i
                                className="bi bi-plus-square-fill"
                                title="LEADER"
                            ></i>
                        </span>

                    <button
                        className='bottone'
                        onClick={() => setNewGroupPopupActive(true)}
                        >
                        CREA NUOVO GRUPPO
                    </button>

                </div>

                <div className='gruppi-bottone'>

                        <span className="icona-gruppo">
                            <i
                                className="bi bi-person-fill-add"
                                title="LEADER"
                            ></i>
                        </span>

                    <button
                        className='bottone'
                        onClick={() => setAddGroupPopupActive(true)}
                        >
                        UNISCITI AD UN GRUPPO
                    </button>
                    
                </div>

            </div>

                

            

            <Modal show={newGroupPopupActive} onHide={() => setNewGroupPopupActive(false)}>
                
                <Modal.Header closeButton>
                    <Modal.Title>Crea un nuovo gruppo</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nome nuovo gruppo"
                            value={nomeGruppo}
                            onChange={(e) => setNomeGruppo(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    
                    <Button
                        variant="secondary"
                        className="add-button"
                        onClick={() => {
                            setNewGroupPopupActive(false)
                        }}
                        >
                        Close
                    </Button>

                    <Button
                        variant="primary"
                        className="add-button"
                        onClick={() => {
                            creaGruppo(nomeGruppo);
                            setNewGroupPopupActive(false);
                            setNomeGruppo("");
                        }}
                    >
                        Crea gruppo
                    </Button>
                </Modal.Footer>
    
            </Modal>


            <Modal show={addGroupPopupActive} onHide={() => setAddGroupPopupActive(false)}>
                
                <Modal.Header closeButton>
                    <Modal.Title>Unisciti ad un gruppo</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Codice</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="codice gruppo"
                            value={codice}
                            onChange={(e) => setCodice(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" className="add-button" onClick={() => setAddGroupPopupActive(false)}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        className="add-button"
                        onClick={() => {
                            setAddGroupPopupActive(false);
                            setCodice("");
                            uniscitiGruppo(codice);
                        }}
                    >
                        Unisciti
                    </Button>
                </Modal.Footer>
    
            </Modal>

        </div> 

    );
}