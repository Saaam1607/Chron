import { useState, useEffect } from 'react';

import SalaStudio from './SalaStudio';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SaleStudio.css';



export default function GruppiDashboard(){

    const [listaSaleStudio, setListaSaleStudio] = useState([]);

    useEffect(() => {
        getSaleStudio();
    }, []);



    function getSaleStudio(){
        fetch('api/v1/saleStudio', {
            method: "GET",
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(data => {
                    if (data){ // c'è qualche sala studio
                        if (Array.isArray(data) && data.length > 0){
                            setListaSaleStudio(data);
                        }
                    } else { //altrimenti
                        setListaSaleStudio([]);
                    }
                })
                    .catch(error => {
                        alert(error.message);
                    })
    }



    return (

        
        <div className='listaSaleStudio'>
            
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Cerca per nome..." aria-label="Cerca" aria-describedby="button-cerca"/>
                <button class="btn btn-primary" type="button" id="button-cerca">Cerca per nome</button>
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Cerca per indirizzo..." aria-label="Cerca" aria-describedby="button-cerca"/>
                <button class="btn btn-primary" type="button" id="button-cerca">Cerca per indirizzo</button>
            </div>

            <div className='salaStudio'>

                {listaSaleStudio.map(item => (
                    <div key={item._id}>
                        <SalaStudio data={item}/>
                    </div>
                ))}

            </div>



        </div> 

    );
}