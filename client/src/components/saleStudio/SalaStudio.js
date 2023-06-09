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
                {data.restrictions && <p className='salaStudio-restrizioni'>Accesso limitato da restrizioni</p>}

                <div className='salaStudio-title'>
                    <p className='salaStudio-rating'>{data.rating / 10}</p>
                    <Rating rating={data.rating} />
                </div>

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