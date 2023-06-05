import React, { useState } from 'react';

import Rating from './Rating';



export default function SalaStudio({data}){



    return (

        <div>

            <div className='salaStudio-div'>
                <h4 className='salaStudio-nome'>{data.name}</h4>
                <p className='salaStudio-indirizzo'>{data.address}</p>
                <p className='salaStudio-restrizioni'>{data.restrictions}</p>
                <p className='salaStudio-rating'>{data.rating}</p>
                <Rating rating={data.rating} />
            </div> 

        </div> 

    );
}