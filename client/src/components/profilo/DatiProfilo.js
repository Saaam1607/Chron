import { useState, useEffect } from 'react';

import CookieManager from'../tokenManager/cookieManager';



export default function Profilo({setAuthenticated}){

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
      <div>
            <div className='data-div'>
                <h4 className="data-h"> username: </h4>
                <p className="data-p">{username}</p>
            </div>

            <div className='data-div'>
                <h4 className="data-h">email: </h4>
                <p className="data-p">{email}</p>
            </div>
            
            <button
                onClick={() => {
                    CookieManager.deleteAuthToken();
                    setAuthenticated(false);
                    }}
            >
                Logout
            </button>
            
      </div>
    );
}