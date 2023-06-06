import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import CookieManager from'../tokenManager/cookieManager';
import { handleAlert } from '../alert/Alert';

export default function SessionForm({onClose}){
    
    const today = new Date();

    const [date, setDate] = useState(new Date(today).toISOString().split('T')[0]); // yyyy-mm-dd
    const [time, setTime] = useState('');
    


    function handleSubmit(){

        let[ore, minuti] = time.split(":");
        const minutiTotali = parseInt(minuti) + parseInt(ore * 60);

        fetch('api/v1/timerSessione', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({minuti: minutiTotali, date: date})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400){
                    throw new Error("Input non validi");
                } else if (response.status === 401){
                    throw new Error("Devi essere autenticato per poter salvare una sessione!");
                } else if (response.status === 500){
                    throw new Error("Errore durante il salvataggio della sessione");
                }
            })
                .then(() => {
                    handleAlert ("Sessione salvata", false, "success", 1000);
                })
                    .catch(error => {
                        alert(error.message);
                    })
    };



    return (
        <Modal
            show={true}
            onHide={onClose}
            dialogClassName="custom-modal-dialog"
            backdrop="static"
            style={{ minWidth: '500pt'}}
        >

            <Modal.Header closeButton>

                <Modal.Title>Salvataggio sessione manuale</Modal.Title>

            </Modal.Header>

            <Modal.Body>
            
                <Form.Group controlId='dataForm'>
                    <div className='setting-div'>
                        <Form.Label>Data:</Form.Label>
                        <Form.Control
                                className="input-field"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                        />
                    </div>
                </Form.Group>

                <Form.Group controlId="timeForm">
                    <div className='setting-div'>
                        <Form.Label>Time:</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </Form.Group>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="primary"
                    type="submit"
                    className="add-button"
                    onClick={()=> {
                        handleSubmit();
                        onClose();
                    }}
                >
                    Salva sessione
                </Button>

                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>

            </Modal.Footer>

        </Modal>
    );
}