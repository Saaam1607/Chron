import React, { useState } from 'react';

import Rating from './Rating';
import SalaStudioDetailsModal from'./SalaStudioDetailsModal';



export default function SalaStudio({data}){

    const [showModal, setShowModal] = useState(false);
    
    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };



    return (
        <div
            onClick={() => {
                if (!showModal){
                    handleOpenModal()
                }   
        }}>
            <div className='salaStudio-div'>

                <div className='salaStudio-title'>
                    <span className="icona-salaStudio">
                        <i
                            className="bi bi-buildings"
                            title="SALA STUDIO"
                        ></i>
                    </span>
                    <h4 className='salaStudio-nome'>{data.name}</h4>
                </div>

                <p className='salaStudio-indirizzo'>{data.address}</p>
                <p className='salaStudio-restrizioni'>{data.restrictions}</p>
                <p className='salaStudio-rating'>{data.rating}</p>
                <Rating rating={data.rating} />
            </div>

                {showModal && (
                    <SalaStudioDetailsModal
                        data={data}
                        onClose={handleCloseModal}
                    />
                )}

        </div> 
    );
}