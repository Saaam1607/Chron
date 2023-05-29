import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';
import Gruppo from './Gruppo';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Gruppi.css';
import { Button, Form, Table, Modal } from "react-bootstrap";



export default function GruppiDashboard(){

    const [gruppiMembro, setGruppiMembro] = useState([]);
    const [gruppiLeader, setGruppiLeader] = useState([]);

    const [popupActive, setPopupActive] = useState(false);
    const [nomeGruppo, setNomeGruppo] = useState("");

    useEffect(() => {

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
                    if (Array.isArray(data.result) && data.length === 0){
                    } else {
                        setGruppiMembro(data.result);
                    }
                })
                .catch(error => {
                    alert(error.message);
                })

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
                    if (Array.isArray(data.result) && data.length === 0){
                    } else {
                        setGruppiLeader(data.result);
                    }
                    
                })
                .catch(error => {
                    alert(error.message);
                })

    }, []);


    return (
        <div className='Gruppi'>
            
            <div className='gruppi-leader'>

                {gruppiLeader.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_username} isLeader={true}/>
                    </div>
                ))}

            </div>


            <div className='gruppi-membro'>

                {gruppiMembro.map(item => (
                    <div key={item._id}>
                        <Gruppo groupName={item.name} groupID={item._id} leader={item.leader_username} members={["CHRIS", "NICOLE"]}/>
                    </div>
                ))}

            </div>

            <div className='gruppi-bottoone-creazione'>

                    <span className="icona-gruppo">
                        <i
                            className="bi bi-plus-square-fill"
                            title="LEADER"
                        ></i>
                    </span>

                <button
                    className='bottone-creazione'
                    onClick={() => setPopupActive(true)}
                    >
                    CREA NUOVO GRUPPO
                </button>

            </div>

            <Modal show={popupActive} onHide={() => setPopupActive(false)}>
                
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
                    <Button variant="secondary" className="add-button" onClick={() => setPopupActive(false)}>
                        Close
                    </Button>
                    <Button variant="primary" className="add-button" onClick={() => {console.log("AGGIUNGO"); setPopupActive(false)}}>
                        Add
                    </Button>
                </Modal.Footer>
    
            </Modal>

        </div> 

    );
}