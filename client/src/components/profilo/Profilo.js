//import { useState, useEffect } from 'react';
import Login from "./Login"
import './Profilo.css';

export default function Profilo(){



    return (
      <div className="Profilo">
        <h1>Profilo</h1>
        <div className="bottoni">
            <div>
                <button className="auth-button">REGISTRATI</button>
            </div>
            <div>
                <button className="auth-button">LOGIN</button>
            </div>
        </div>
        <div>
            <Login/>
        </div>

      </div>
    );
}