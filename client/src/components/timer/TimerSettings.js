import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './TimerSettings.css';
import { handleAlert } from '../alert/Alert';



export default function TimerSettings({readTimerData, onClose}){

    const [pomdoro, setPomdoro] = useState(25);
    const [pausaCorta, setPausaCorta] = useState(5);
    const [pausaLunga, setPausaLunga] = useState(15);
    const [numeroSessioni, setNumeroSessioni] = useState(4);

    function handleNuovoPomodoro(value){
        if (value < 15){
            setPomdoro(15);
        } else if (value > 60){
            setPomdoro(60);
        } else {
            setPomdoro(value);
        }
    }

    function handleNuovaPausaCorta(value){
        if (value < 5){
            setPausaCorta(5);
        } else if (value > 15){
            setPausaCorta(15);
        } else {
            setPausaCorta(value);
        }
    }

    function handleNuovaPausaLunga(value){
        if (value < 15){
            setPausaLunga(15);
        } else if (value > 30){
            setPausaLunga(30);
        } else {
            setPausaLunga(value);
        }
    }

    function handleNuovoNumeroSessioni(value){
        if (value < 2){
            setNumeroSessioni(2);
        } else if (value > 6){
            setNumeroSessioni(6);
        } else {
            setNumeroSessioni(value);
        }
    }



    async function aggiornaImpostazioni(pomdoro, pausaCorta, pausaLunga, sessioni){
        setPomdoro(pomdoro);
        setPausaCorta(pausaCorta);
        setPausaLunga(pausaLunga);
        setNumeroSessioni(sessioni);
    }



    function leggiImpostazioni(){
        fetch('api/v1/timer/impostazioni', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 500){
                    throw new Error("Errore durante la lettura delle impostazioni");
                }
            })
                .then(data => {
                    aggiornaImpostazioni(data.durataPomodoro, data.durataPausaCorta, data.durataPausaLunga, data.pomodoriPerSessione);
                })
                .catch(error => {
                    alert(error.message);
                })
    }





    useEffect(() => {
        // quando il componente viene aperto, viene eseguita una lettura delle impostazioni attuali del timer
        leggiImpostazioni();
    }, []);
  

    
    function handleSubmit(){
        const requestBody = {
            pomdoro: pomdoro,
            pausaCorta: pausaCorta,
            pausaLunga: pausaLunga,
            sessioni: numeroSessioni
        };
      
        fetch('api/v1/timer/impostazioni/aggiorna', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                } else if (response.status === 500){
                    throw new Error("Errore durante la modifica delle impostazioni");
                }
            })
                .then(() =>{
                    readTimerData();
                    handleAlert ("Modifica salvata", false, "success", 1000);
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
                style={{ minWidth: 'fit-content'}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Impostazioni del timer</Modal.Title>
                </Modal.Header>
        
                <Modal.Body>
                
                    <Form.Group controlId="pomdoro">
                        <div className='setting-div'>
                            <Form.Label className="setting-label">Durata pomodoro:</Form.Label>
                            <Form.Control
                                    className="input-field"
                                    type="number"
                                    value={pomdoro}
                                    onChange={(e) => setPomdoro(parseInt(e.target.value))}
                                    onBlur={(e) => handleNuovoPomodoro(parseInt(e.target.value))}
                                    min="15"
                                    max="60"
                                    required
                            />
                        </div>
                    </Form.Group>
        
                    <Form.Group controlId="pausa-corta">
                        <div className='setting-div'>
                            <Form.Label className="setting-label">Durata pausa corta:</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="number"
                                value={pausaCorta}
                                onChange={(e) => setPausaCorta(parseInt(e.target.value))}
                                onBlur={(e) => handleNuovaPausaCorta(parseInt(e.target.value))}
                                min="5"
                                max="15"
                                required
                            />
                        </div>
                    </Form.Group>
        
                    <Form.Group controlId="pausaLunga">
                        <div className='setting-div'>
                            <Form.Label className="setting-label">Durata pausa lunga:</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="number"
                                value={pausaLunga}
                                onChange={(e) => setPausaLunga(parseInt(e.target.value))}
                                onBlur={(e) => handleNuovaPausaLunga(parseInt(e.target.value))}
                                min="10"
                                max="30"
                                required
                            />
                        </div>
                    </Form.Group>
        
                    <Form.Group controlId="numeroSessioni">
                        <div className='setting-div'>
                            <Form.Label className="setting-label">Numero sessioni:</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="number"
                                value={numeroSessioni}
                                onChange={(e) => setNumeroSessioni(parseInt(e.target.value))}
                                onBlur={(e) => handleNuovoNumeroSessioni(parseInt(e.target.value))}
                                min="2"
                                max="6"
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
                            handleSubmit()
                            onClose()
                        }}
                    >
                        Salva
                    </Button>

                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
    );
}