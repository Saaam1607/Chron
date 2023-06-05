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

                    console.log(data);
                    console.log(data.length);

                    if (data){ // c'è qualche gruppo
                        if (Array.isArray(data) && data.length > 0){
                            setListaSaleStudio(data);
                        }
                    } else { // non ci sono gruppi
                        setListaSaleStudio([]);
                    }
                })
                    .catch(error => {
                        alert(error.message);
                    })
    }



    return (

        
        <div className='listaSaleStudio'>

            <h1>Lista Sale Studio</h1>


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