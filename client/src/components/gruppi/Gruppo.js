import React, { useState } from 'react';

import GroupDetailsModal from'./GroupDetailsModal';

export default function Gruppo({ groupName, groupID, leader, membersData, isLeader, setNuovoGruppo, setRimozioneMembro}){


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
                    _id={groupID}
                    groupName={groupName}
                    leader={leader}
                    members={membersData}
                    isLeader={isLeader}
                    onClose={handleCloseModal}
                    setNuovoGruppo={setNuovoGruppo}
                    setRimozioneMembro={setRimozioneMembro}
                />
            )}

        </div> 

    );
}