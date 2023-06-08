import React, { useEffect, useState,useContext } from "react";
import { GoogleLogin } from '@react-oauth/google';
import CookieManager from'../tokenManager/cookieManager';
import { handleAlert } from "../alert/Alert";



export default function AutenticazioneEsterna({setIsAuthenticated}) {

    
    
    const continueWithGoogle =(credentialResponse)=>{

        fetch("api/v1/profilo/autenticazioneEsterna", {
        method: "post",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gToken: credentialResponse.credential,
            clientId: credentialResponse.clientId
        })
        }).then(res => res.json())
        .then(data => {
            if (data.success === false) {
                handleAlert(data.message, false, "error")
            } else {
                CookieManager.setAuthToken(data.token);
                setIsAuthenticated(true);
            }
        })
    }

    return (
        <div className="auth-esterna-div" >
            <GoogleLogin 
                onSuccess={credentialResponse => {
                    continueWithGoogle(credentialResponse)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
}