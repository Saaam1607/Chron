import React, { useState } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';

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
                    <Modal.Title>{data.name}</Modal.Title>
                </Modal.Header>

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
