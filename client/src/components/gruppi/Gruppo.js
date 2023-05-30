import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

import GroupDetailsModal from'./GroupDetailsModal';

export default function Gruppo({ groupName, groupID, leader, isLeader}){


    const [showModal, setShowModal] = useState(false);
    
    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };



    return (
        <div
            className="gruppo-div"
            onClick={() => {
                if (!showModal){
                    console.log(groupName)
                handleOpenModal()
                }
                
            }}
        >

            <div className="gruppo-title">
                {isLeader ?
                    <span className="icona-gruppo">
                        <i
                            className="bi bi-star-fill"
                            title="LEADER"
                        ></i>
                    </span>
                    :
                    <span className="icona-gruppo">
                        <i
                            className="bi bi-person"
                            title="LEADER"
                        ></i>
                    </span>
                }
                <h4 className="nomeGruppo">{groupName}</h4>
            </div> 

            <h6 className="codice">Codice<br/>{groupID}</h6>

            <div className="gruppo-componenti">
                <h6>Leader: <b><u>{leader}</u></b></h6>
            </div>

            {showModal && (
                <GroupDetailsModal
                    groupName={groupName}
                    description={"ciao"}
                    leader={"leader"}
                    members={"membro"}
                    onClose={handleCloseModal}
                />
            )}

        </div> 

    );
}