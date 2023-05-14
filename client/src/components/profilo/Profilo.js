import { useState, useEffect } from 'react';
//import { useState } from 'react';
import Login from "./Login"
import Registrazione from './Registrazione';
import DatiProfilo from "./DatiProfilo"
import './Profilo.css';


export default function Profilo(){

    const [authenticated, setAuthenticated] = useState(false);

    const [loginClicked, setLoginClicked] = useState(false);
    const [registrazioneClicked, setRegistrazoneClicked] = useState(false);

    useEffect(() => {
        console.log(authenticated)
    }, [authenticated])

    return (
      <div className="Profilo">
        <h1>Profilo</h1>
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
        <div>
            {(!authenticated && loginClicked) ? <Login setAuthenticated={setAuthenticated}/> : <></> }
            {(registrazioneClicked) ? <Registrazione setAuthenticated={setAuthenticated}/> : <></> }
            
        </div>

      </div>
    );
}