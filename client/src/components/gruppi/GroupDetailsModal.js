import React, { useState } from 'react';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import TaskAssignment from './TaskAssignment';
import { handleAlert } from '../alert/Alert';
import CookieManager from '../tokenManager/cookieManager';



export default function GroupDetailsModal ({_id, groupName, leader, members, isLeader, onClose, setNuovoGruppo }){

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showTaskAssignmentModal, setShowTaskAssignmentModal] = useState(false);

    const handleMemberSelection = (member) => {
        const isSelected = selectedMembers.some((selectedMember) => selectedMember.id === member.id);
        if (isSelected) {
          setSelectedMembers(selectedMembers.filter((selectedMember) => selectedMember.id !== member.id));
        } else {
          setSelectedMembers([...selectedMembers, member]);
        }
    };

    const handleAssignTask = () => {
        setShowTaskAssignmentModal(true);
    };

    const handleTaskAssignmentClose = () => {
        setShowTaskAssignmentModal(false);
    };

    const [confermaEliminazioneModal, setConfermaEliminazioneModal] = useState(false);
    const [esistenzaGruppo, setEsistenzaGruppo] = useState(true);

    function handleEliminazione(){
        fetch(`api/v1/gruppi/${_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            }
        })
            .then(response => {

                if (response.ok) {
                    return
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw ({status: 500, errorData: errorData.message});
                    });
                }
            })
                .then(() => {
                    setNuovoGruppo("GRUPPO ELIMINATO");
                    handleAlert("ELIMINAZIONE COMPLETATA", false, "success");
                })
                    .catch(error => {

                        //handleAlert(message, false, "error");
                    })

    }

    return (
        <div>


            <Modal
                className='gruppo-modal'
                show={!showTaskAssignmentModal && !confermaEliminazioneModal && esistenzaGruppo}
                onHide={onClose}
                dialogClassName="custom-modal-dialog"
                backdrop="static"
                style={{ minWidth: '800pt' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{groupName}</Modal.Title>
                </Modal.Header>

            <Modal.Body>
                
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

                <div className='members-div'>
                    <Table className='members-table' bordered hover>
                        <thead>
                            <tr>
                            <th>Membro</th>
                            <th>Email</th>
                            <th>Seleziona</th>
                            <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {members[0].length > 0 ? (
                            members[0].map((membro) => (
                                <tr key={membro[0]}>
                                <td>{membro[1]}</td>
                                <td>{membro[2]}</td>
                                <td className="text-center">
                                    {isLeader && (
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedMembers.some((selectedMember) => selectedMember.id === membro[0])}
                                            onChange={() => handleMemberSelection({ id: membro[0], name: membro[1], email: membro[2] })}
                                        />
                                    )}
                                </td>
                                <td className="text-center">
                                    {isLeader && (
                                    <Button variant="danger" onClick={() => console.log('RIMUOVI')}>
                                        Rimuovi
                                    </Button>
                                    )}
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                Non ci sono membri da mostrare.
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

            <div className="text-center">
                {isLeader && 
                    <Button variant="danger" style={{ width: "auto" }} onClick={() => {setConfermaEliminazioneModal(true)}}>
                        ELIMINA GRUPPO
                    </Button>
                }
            </div>


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                    Close
                    </Button>
                    {isLeader && (
                    <Button variant="primary" className={`add-button ${selectedMembers.length < 1 ? 'disabled' : ''}`} onClick={handleAssignTask}>
                        Assegna Task
                    </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showTaskAssignmentModal} onHide={handleTaskAssignmentClose} backdrop="static"  >
                <Modal.Header closeButton>
                <Modal.Title>Assegna Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <TaskAssignment selectedMembers={selectedMembers} groupName={groupName} ID_gruppo={_id} onClose={handleTaskAssignmentClose} />
                </Modal.Body>
            </Modal>

            {confermaEliminazioneModal &&
                <Modal show={confermaEliminazioneModal} onHide={() => setConfermaEliminazioneModal(false)}>
                
                    <Modal.Header closeButton>
                        <Modal.Title>Conferma eliminazione gruppo</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Card.Subtitle className="mb-2 text-muted">Attenzione, l'eliminazione del gruppo è definitiva. L'operazione non potrà essere ripristinata in alcun modo. Procedere ugualmente? </Card.Subtitle>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button variant="danger" style={{ width: "auto" }} onClick={() => {setConfermaEliminazioneModal(false); setEsistenzaGruppo(false); handleEliminazione()}}>
                            CONFERMA
                        </Button>

                        <Button variant="primary" style={{ width: "auto" }} onClick={() => {setConfermaEliminazioneModal(false)}}>
                            ANNULLA
                        </Button>

                    </Modal.Footer>

                </Modal>
            }
        </div>
    );
}
