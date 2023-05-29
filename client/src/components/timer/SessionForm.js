import { useState, useEffect } from 'react';
import CookieManager from'../tokenManager/cookieManager';
import { Z_BINARY } from 'zlib';

export default function SessionForm(){
    
    const today = new Date();

    const [date, setDate] = useState(new Date(today).toISOString().split('T')[0]); // yyyy-mm-dd
    const [time, setTime] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let[hours, mins] = time.split(":");
        const minutes = parseInt(mins) + parseInt(hours * 60);

        fetch('api/v1/timer/salva-sessione', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({minuti: minutes, date: date})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400){
                    throw new Error("Input non validi");
                } else if (response.status === 401){
                    throw new Error("Devi essere autenticato per poter salvare una sessione!");
                } else if (response.status === 500){
                    throw new Error("Errore durante il salvataggio della sessione");
                }
            })
                .then(data => {
                    //console.log("SALVATO")
                })
                .catch(error => {
                    alert(error.message);
                })
    };

    return (
            <form className='timer-form' onSubmit={handleSubmit}>
                <div className='form-div'>

                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        min="00:10"
                        max="10:00"
                        required
                    />

                </div>

                <div className='form-button'>
                    <button type="submit">Submit</button>
                </div>

            </form>
    );
}