import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Table } from 'react-bootstrap';

import CookieManager from'../tokenManager/cookieManager';

export default function GroupDetailsModal ({ _id, groupName, leader, members, isLeader, onClose }){

    const [confermaEliminazioneModal, setConfermaEliminazioneModal] = useState(false);

    function handleEliminazione(){
        fetch(`api/v1/gruppi/eliminaGruppo/${_id}`, {
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

                })
                    .catch(error => {

                        //handleAlert(message, false, "error");
                    })

    }

  
    return (
        <div>
    <Modal show={!confermaEliminazioneModal} onHide={onClose}>
      
      <Modal.Header closeButton>
        <Modal.Title>{groupName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Card.Subtitle className="mb-2 text-muted">Leader: {leader}</Card.Subtitle>
        
        <Table bordered hover>
            
            <thead>
                <tr>
                    <th>Membro</th>
                    <th>Email</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
                
            <tbody>
                {members[0].length > 0 ? (

                    members[0].map((membro) => (
                        <tr key={membro}>
                            
                            <td>{membro[1]}</td>

                            <td>{membro[2]}</td>
                            
                            <td className="text-center"> 
                                {isLeader &&
                                    <Button variant="primary" onClick={() => {console.log("ASSEGNA")}}>
                                        Assegna
                                    </Button>
                                }
                            </td>
                            
                            <td className="text-center">
                                {isLeader &&
                                    <Button variant="danger" onClick={() => {console.log("RIMUOVI")}}>
                                        Rimuovi
                                    </Button>
                                }
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
      </Modal.Footer>

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

            <Button variant="danger" style={{ width: "auto" }} onClick={() => {setConfermaEliminazioneModal(false); handleEliminazione()}}>
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
};

