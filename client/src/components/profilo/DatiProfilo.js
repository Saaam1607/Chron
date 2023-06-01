import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';

import UsernameModal from './profileModificationsModals/UsernameModal';



export default function Profilo({setAuthenticated, mostraUsernameModal, setMostraUsernameModal}){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");





    useEffect(() => {
        // ricerca dei dati utente
        fetch("/api/v1/profilo/data", {
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
            } else if (response.status === 500){
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
        })
                .then(data => {
                    // setta i dati utente
                    setUsername(data.username);
                    setEmail(data.email);
                })
                    .catch(error => {
                        alert(error.message);
                    })
            
    }, [])


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
                        console.log("Username");
                        setMostraUsernameModal(true);
                    }}
                >
                    Modifica username
                </button>

                <button
                    className='data-modification-button'
                    onClick={() => {
                        console.log("Email");
                    }}
                >
                    Modifica email
                </button>

                <button
                    className='data-modification-button'
                    onClick={() => {
                        console.log("Password");
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
                        setAuthenticated(false);
                        }}
                >
                    Logout
                </button>
            </div>

            <UsernameModal mostraUsernameModal={mostraUsernameModal} setMostraUsernameModal={setMostraUsernameModal}/>


            
      </div>
    );
}