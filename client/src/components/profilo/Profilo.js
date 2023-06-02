import { useState } from 'react';
import Login from "./Login"
import Registrazione from './Registrazione';
import DatiProfilo from "./DatiProfilo"
import './Profilo.css';
import CookieManager from'../tokenManager/cookieManager';


export default function Profilo(){

    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);

    const [loginClicked, setLoginClicked] = useState(false);
    const [registrazioneClicked, setRegistrazoneClicked] = useState(false);

    const [mostraUsernameModal, setMostraUsernameModal] = useState(false);



    return (
      <div className="Profilo">
        <h1>Profilo</h1>

        {isAuthenticated ? <div>
            <DatiProfilo
                setIsAuthenticated={setIsAuthenticated}

                mostraUsernameModal={mostraUsernameModal}
                setMostraUsernameModal={setMostraUsernameModal}/>
        </div> : <></>}

            {!isAuthenticated ? <div>
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
        
        {!isAuthenticated ? <div>  
            {(loginClicked) ? <Login setIsAuthenticated={setIsAuthenticated}/> : <></> }
            {(registrazioneClicked) ? <Registrazione setIsAuthenticated={setIsAuthenticated}/> : <></> }
            
        </div> : <></>}

      </div>
    );
}