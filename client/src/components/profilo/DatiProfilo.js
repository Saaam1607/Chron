import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';

import UsernameModal from './profileModificationsModals/UsernameModal';
import EmailModal from './profileModificationsModals/EmailModal';
import PasswordModal from './profileModificationsModals/PasswordModal';



export default function Profilo({setIsAuthenticated}){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [mostraUsernameModal, setMostraUsernameModal] = useState(false);
    const [mostraEmailModal, setMostraEmailModal] = useState(false);
    const [mostraPasswordModal, setMostraPasswordModal] = useState(false);



    useEffect(() => {

        fetch("/api/v1/profiloData", {
            method: "GET",
            headers: CookieManager.generateHeader(),
        })
            .then(response => {

                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else if (response.status === 401){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
            })
                .then(data => {

                    setIsAuthenticated(true);
                    setUsername(data.username);
                    setEmail(data.email);
                })
                    .catch(error => {
                        console.log(error.message);
                    })
            
    }, [mostraUsernameModal, mostraEmailModal, mostraPasswordModal]);



    return (
      <div className='profilo-div'>
            <div className='data-div'>
                <h4 className="data-h"> username: </h4>
                <p className="data-p">{username}</p>
            </div>

            <div className='data-div'>
                <h4 className="data-h">email: </h4>
                <p className="data-p">{email}</p>
            </div>

            <div className='profile-buttons-div'>
            
                <button
                    className='data-modification-button'
                    onClick={() => {
                        setMostraUsernameModal(true);
                    }}
                >
                    Modifica username
                </button>

                <button
                    className='data-modification-button'
                    onClick={() => {
                        setMostraEmailModal(true);
                    }}
                >
                    Modifica email
                </button>

                <button
                    className='data-modification-button'
                    onClick={() => {
                        setMostraPasswordModal(true);
                    }}
                >
                    Modifica password
                </button>
            
            </div>

            <div className='profile-buttons-div'>
                <button
                    className='logout-button'
                    onClick={() => {
                        CookieManager.deleteAuthToken();
                        setIsAuthenticated(false);
                        }}
                >
                    Logout
                </button>
            </div>

            {mostraUsernameModal &&
                <UsernameModal mostraUsernameModal={mostraUsernameModal} setMostraUsernameModal={setMostraUsernameModal}/>
            }

            
            {mostraEmailModal &&
                <EmailModal mostraEmailModal={mostraEmailModal} setMostraEmailModal={setMostraEmailModal}/>
            }

            {mostraPasswordModal &&
                <PasswordModal mostraPasswordModal={mostraPasswordModal} setMostraPasswordModal={setMostraPasswordModal}/>
            }

            
      </div>
    );
}