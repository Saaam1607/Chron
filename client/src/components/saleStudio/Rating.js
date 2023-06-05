import React, { useState } from 'react';
import './Rating.css';


const Star = ({isHalf}) => {
    return (
        <span className={`star ${isHalf ? '' : 'half'}`}>
            ★
            </span>
    );
};



export default function Rating({rating}){

    const stars = [];

    const stelleIntere = Math.floor(rating/10);
    let stellaMezza = 0;
    if (stelleIntere * 10 < rating) {
        stellaMezza = 1;
    }


    for (let i = 0; i < stelleIntere; i++) {
        stars.push(<Star key={i} isHalf={true} />);
    }
    if (stellaMezza === 1) {
        stars.push(<Star key={stelleIntere + 1} isHalf={false} />);
    }

    return (
        <div>
            {stars}
        </div>
    );
}