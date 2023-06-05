import { useState, useEffect } from 'react';

import SalaStudio from './SalaStudio';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SaleStudio.css';



export default function GruppiDashboard(){

    const [toggleState, setToggleState] = useState(false);

    const handleToggleChange = () => {
        setToggleState(!toggleState);
    };


    const [listaSaleStudio, setListaSaleStudio] = useState([]);
    const [nomePerRiceca, setNomePerRicerca] = useState("");
    const [indirizzoPerRicerca, setIndirizzoPerRicerca] = useState("");

    useEffect(() => {
        getSaleStudio(null, null);
    }, []);
    


    function getSaleStudio(nome, posizione){

        let stringaRicerca = ""

        if (!toggleState && nome){
            stringaRicerca = stringaRicerca + "?nome=" + nome;
        }
        if (toggleState && posizione){
            stringaRicerca = stringaRicerca + "?indirizzo=" + posizione;
        }

        fetch(('api/v1/saleStudio' + stringaRicerca), {
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

            <div className="form-check form-switch">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="toggleSwitch"
                    checked={toggleState}
                    onChange={handleToggleChange}
                />
                <label className="form-check-label" htmlFor="toggleSwitch">
                    {toggleState ? 'Ricerca per indirizzo' : 'Ricerca per nome'}
                </label>
            </div>
            
            {!toggleState && 
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cerca per nome..."
                    aria-label="Cerca"
                    aria-describedby="button-cerca"
                    value={nomePerRiceca}
                    onChange={(e) => setNomePerRicerca(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    id="button-cerca"
                    onClick={() => {getSaleStudio(nomePerRiceca, null)}}
                >
                    Cerca per nome
                </button>
            </div>
            }

            {toggleState &&
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cerca per indirizzo..."
                    aria-label="Cerca"
                    aria-describedby="button-cerca"
                    value={indirizzoPerRicerca}
                    onChange={(e) => setIndirizzoPerRicerca(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    id="button-cerca"
                    onClick={() => {getSaleStudio(null, indirizzoPerRicerca)}}
                >
                    Cerca per indirizzo
                </button>
            </div>
            }

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