import { useState, useEffect } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import './TimerSettings.css';



export default function TimerSettings({readTimerData, onClose}){

    const [pomdoro, setPomdoro] = useState(25);
    const [pausaCorta, setPausaCorta] = useState(5);
    const [pausaLunga, setPausaLunga] = useState(15);
    const [numeroSessioni, setNumeroSessioni] = useState(4);

    const aggiornaImpostazioni = async (pomdoro, pausaCorta, pausaLunga, sessioni) => {
        setPomdoro(pomdoro);
        setPausaCorta(pausaCorta);
        setPausaLunga(pausaLunga);
        setNumeroSessioni(sessioni);
    }

    useEffect(() => {

        // recupera dati dal server
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
                    readTimerData()
                })
                .catch(error => {
                    alert(error.message);
                })

    };
  
    return (
        <div>
          <Modal
            className='gruppo-modal'
            show={true}
            onHide={onClose}
            dialogClassName="custom-modal-dialog"
            backdrop="static"
            style={{ minWidth: '800pt' }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Dettagli sala studio</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              
                <Form.Group controlId="pomdoro">
                    <div className='setting-div'>
                        <Form.Label className="setting-label">Durata pomodoro:</Form.Label>
                        <Form.Control
                                className="setting-input"
                                type="number"
                                value={pomdoro}
                                onChange={(e) => setPomdoro(parseInt(e.target.value))}
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
                            className="setting-input"
                            type="number"
                            value={pausaCorta}
                            onChange={(e) => setPausaCorta(parseInt(e.target.value))}
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
                            className="setting-input"
                            type="number"
                            value={pausaLunga}
                            onChange={(e) => setPausaLunga(parseInt(e.target.value))}
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
                            className="setting-input"
                            type="number"
                            value={numeroSessioni}
                            onChange={(e) => setNumeroSessioni(parseInt(e.target.value))}
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
        </div>
      );
    }



        // <form className="timer-form" onSubmit={handleSubmit}>
        
        //     <div className='setting-div'>
        //         <label htmlFor="pomdoro">Durata pomodoro:</label>
        //         <input
        //             type="number"
        //             id="pomdoro"
        //             value={pomdoro}
        //             onChange={(e) => setPomdoro(parseInt(e.target.value))}
        //             min="15"
        //             max="60"
        //             required
        //         />
        //     </div>
    
        //     <div className='setting-div'>
        //         <label htmlFor="pausa-corta">Duarata pausa corta:</label>
        //         <input
        //             type="number"
        //             id="pausa-corta"
        //             value={pausaCorta}
        //             onChange={(e) => setPausaCorta(parseInt(e.target.value))}
        //             min="5"
        //             max="15"
        //             required
        //         />
        //     </div>

        //     <div className='setting-div'>
        //         <label htmlFor="pausaLunga">Durata pausa lunga:</label>
        //         <input
        //             type="number"
        //             id="pausaLunga"
        //             value={pausaLunga}
        //             onChange={(e) => setPausaLunga(parseInt(e.target.value))}
        //             min="10"
        //             max="30"
        //             required
        //         />
        //     </div>

        //     <div className='setting-div'>
        //         <label htmlFor="numeroSessioni">Numero sessioni:</label>
        //         <input
        //             type="number"
        //             id="numeroSessioni"
        //             value={numeroSessioni}
        //             onChange={(e) => setNumeroSessioni(parseInt(e.target.value))}
        //             min="2"
        //             max="6"
        //             required
        //         />
        //     </div>
    
        //     <button type="submit">Save</button>
        // </form>
//     );
// }