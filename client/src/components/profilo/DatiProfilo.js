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
            <div>
                <h2> username: </h2>
                <p>{username}</p>
            </div>
            <div>
                <h2>email: </h2>
                <p>{email}</p>
            </div>
            <div>
                <button>Logout</button>
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