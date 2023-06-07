import { useState } from 'react';
import Login from "./Login"
import Registrazione from './Registrazione';
import DatiProfilo from "./DatiProfilo"
import RecuperoPassword from '../recupera-password/RecuperoPassword';
import './Profilo.css';
import CookieManager from'../tokenManager/cookieManager';
import AutenticazioneEsterna from './AutenticazioneEsterna'


export default function Profilo(){

    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);

    const [loginClicked, setLoginClicked] = useState(false);
    const [registrazioneClicked, setRegistrazoneClicked] = useState(false);
    const [recuperoPasswordClicked, setRecuperoPasswordClicked] = useState(false);


    
    return (
      <div className="Profilo">
        <h1>Profilo</h1>

        {isAuthenticated ? <div>
            <DatiProfilo
                setIsAuthenticated={setIsAuthenticated}
                />
        </div> : <></>}

        

            {!isAuthenticated ? <div>
                <div className='auth-button-div'>
                    <button
                        className="auth-button"
                        onClick={() => {
                            setLoginClicked(false);
                            setRegistrazoneClicked(true);
                            setRecuperoPasswordClicked(false);
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
                            setRecuperoPasswordClicked(false);
                        }}
                    >
                        LOGIN
                    </button>
                </div>
                <div className='auth-button-div'>
                    <button
                        className="auth-button"
                        onClick={() => {
                            setLoginClicked(false);
                            setRegistrazoneClicked(false);
                            setRecuperoPasswordClicked(true);
                        }}
                    >
                        <h6>RECUPERA PASSWORD</h6>
                    </button>
                </div>
            </div> : <></> }
        
        {!isAuthenticated ? <div>  
            {(loginClicked) ? <Login setIsAuthenticated={setIsAuthenticated}/> : <></> }
            {(registrazioneClicked) ? <Registrazione setIsAuthenticated={setIsAuthenticated}/> : <></> }
            {(recuperoPasswordClicked) ? <RecuperoPassword setAuthenticated={setIsAuthenticated} /> : <></> }
            { <AutenticazioneEsterna setIsAuthenticated={setIsAuthenticated} /> }

            
        </div> : <></>}




      </div>
    );
}