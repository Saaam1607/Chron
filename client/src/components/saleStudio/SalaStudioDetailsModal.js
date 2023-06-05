import React, { useState } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import Rating from './Rating';
import BottonePerMappa from './BottonePerMappa';


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
                                    <div className='orario-div' key={giorno.day}>
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
                                <p className='salaStudio-restrizioni'>ACCESSO LIMITATO DA RESTRIZIONI: <br/>{data.restrictions}</p>
                            </div>

                            <div>
                                <BottonePerMappa address={data.address}/>
                            </div>

                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>


        </div>
    );
}
