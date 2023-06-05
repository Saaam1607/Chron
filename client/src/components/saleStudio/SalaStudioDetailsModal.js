import React, { useState } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import Rating from './Rating';



export default function SalaStudioDetailsModal ({data, onClose}){

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

                    <div className='salaStudio-title'>
                        <span className="icona-salaStudio">
                            <i
                                className="bi bi-buildings"
                                title="SALA STUDIO"
                                style={{ fontSize: '5rem' }}
                            ></i>
                        </span>

                        <div>
                            <div className='title-header'>
                                <h4 className='salaStudio-nome'>{data.name}</h4>
                                <div className='salaStudio-title'>
                                    <p className='salaStudio-rating'>{data.rating / 10}</p>
                                    <Rating rating={data.rating} />
                                </div>
                            </div>

                            <div className='orari-div'>
                                {data.openingHours.map((giorno, index) => (
                                    <div className='orario-div'>
                                        <p className="dettagli-orario">{giorno.day}</p>
                                        { giorno.isOpen ?
                                            <p className="dettagli-orario-apertura">{giorno.openingTime} - {giorno.closingTime}</p>
                                            :
                                            <p className="dettagli-orario-apertura">Chiuso</p>
                                        }
                                    </div>
                                ))}
                            </div>

                            <div className='container-elementi-posizione'>
                                <p className='salaStudio-indirizzo'>{data.address}</p>
                                <p className='salaStudio-restrizioni'>{data.restrictions}</p>
                            </div>

                        </div>

                    </div>

                    

                </Modal.Body>

                {/* <Modal.Body>
                    
                    <div className='members-div'>
                        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '2em' }}>Leader: {leader}</Card.Subtitle>
                    </div>

                    <div className='members-div'>
                        
                        <div className='codice-div'>
                                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '2em' }}>Codice: {_id}</Card.Subtitle>

                                <span className="icona-copy">
                                <i
                                    className="bi bi-clipboard-plus"
                                    title="CLICCA PER COPIARE IL CODICE DEL GRUPPO"
                                    onClick={() => {
                                        navigator.clipboard.writeText(_id);
                                    }}
                                ></i>

                            </span>
                        </div>

                    </div>



                    <div className="text-center">
                        {isLeader && 
                            <Button variant="danger" style={{ width: "auto" }} onClick={() => {setConfermaEliminazioneModal(true)}}>
                                ELIMINA GRUPPO
                            </Button>
                        }
                    </div>

                    <div className="text-center">
                        {!isLeader && 
                            <Button variant="danger" style={{ width: "auto" }} onClick={() => {setConfermaAbbandonoModal(true)}}>
                                ABBANDONA GRUPPO
                            </Button>
                        }
                    </div>

                </Modal.Body> */}

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>


        </div>
    );
}
