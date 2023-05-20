import { useState, useEffect } from 'react';
//import { useState } from 'react';
import Login from "./Login"
import Registrazione from './Registrazione';
import DatiProfilo from "./DatiProfilo"
import './Profilo.css';
const tokenManager = require('../tokenManager/cookieManager');


export default function Profilo(){

    const [authenticated, setAuthenticated] = useState(false);

    const [loginClicked, setLoginClicked] = useState(false);
    const [registrazioneClicked, setRegistrazoneClicked] = useState(false);

    useEffect(() => {
        // Cerco l'id. Se è presente leggo dal db, altrimenti bottoni di auth
        fetch("api/v1/profilo/data", {
            method: "GET",
            headers: tokenManager.generateHeader()
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            setAuthenticated(data.success)
                        })
                } else {
                    console.log("token non trovato");
                }
            })

    }, [])

    return (
      <div className="Profilo">
        <h1>Profilo</h1>

        {authenticated==true ? <div>
            <DatiProfilo setAuthenticated={setAuthenticated}/>
        </div> : <></>}

            {authenticated==false ? <div>
                <div className='auth-button-div'>
                    <button
                        className="auth-button"
                        onClick={() => {
                            setLoginClicked(false);
                            setRegistrazoneClicked(true);
                        }}
                    >
                        REGISTRATI
                    </button>
                </div>
                <div className='auth-button-div'>
                    <button
                        className="auth-button"
                        onClick={() => {
                            setLoginClicked(true);
                            setRegistrazoneClicked(false);
                        }}
                    >
                        LOGIN
                    </button>
                </div>
            </div> : <></> }
        {authenticated==false ? <div>  
            {(loginClicked) ? <Login setAuthenticated={setAuthenticated}/> : <></> }
            {(registrazioneClicked) ? <Registrazione setAuthenticated={setAuthenticated}/> : <></> }
            
        </div> : <></>}

      </div>
    );
}