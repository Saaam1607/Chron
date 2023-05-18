import { useState, useEffect } from 'react';
const authenticate = require('../tokenManager/tokenAuthenticator.js');
const CookieManager = require("../tokenManager/cookieManager.js")

export default function Todo(){


    useEffect(() => {
        console.log("TODO")

         

    },[] )

    return (
        <div>
            <h1>TO-DO</h1>
        </div>
    );
}