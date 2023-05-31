import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Table } from 'react-bootstrap';

import CookieManager from'../tokenManager/cookieManager';

export default function GroupDetailsModal ({ groupName, leader, members, isLeader, onClose }){




  
    // function getNomeFromID(id){
    //     fetch(`api/v1/gruppi/username?id=${id}`, {
    //         method: "GET",
    //         headers: CookieManager.generateHeader()
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 response.json()
    //                     .then(data => {
    //                         console.log("PROVO")
    //                         console.log(data)
    //                         return data;
    //                     })
    //             } else {
    //                 return "INSOMMA";
    //             }
    //         })
    // }
  
    return (
    <Modal show={true} onHide={onClose}>
      
      <Modal.Header closeButton>
        <Modal.Title>{groupName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Card.Subtitle className="mb-2 text-muted">Leader: {leader}</Card.Subtitle>
        
        <Table bordered hover>
            
            <thead>
                <tr>
                    <th>Membro</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
                        
            <tbody>
                {members.length > 0 ? (
                    members.map((membro) => (
                        <tr key={membro}>
                            
                            <td>(membro)</td>
                            
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
      
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

