import React, { useEffect, useState,useContext } from "react";
import { GoogleLogin } from '@react-oauth/google';




export default function SignUp() {
    
    const continueWithGoogle =(credentialResponse)=>{
        console.log(credentialResponse);

    }

    return (
        <div className="signUp">
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