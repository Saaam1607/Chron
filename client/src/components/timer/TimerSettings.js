import { useState, useEffect } from 'react';

export default function TimerSettings({readTimerData}){

    const [pomdoro, setPomdoro] = useState(25);
    const [pausaCorta, setPausaCorta] = useState(5);
    const [pausaLunga, setPausaLunga] = useState(15);
    const [numeroSessioni, setNumeroSessioni] = useState(4);

    const aggiornaImpostazioni = async (pomdoro, pausaCorta, pausaLunga, sessioni) => {
        setPomdoro(pomdoro);
        setPausaCorta(pausaCorta);
        setPausaLunga(pausaLunga);
        setNumeroSessioni(sessioni);
    }

    useEffect(() => {

        // recupera dati dal server
        fetch('api/v1/timer/impostazioni', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                //imposta dati
                aggiornaImpostazioni(data.durataPomodoro, data.durataPausaCorta, data.durataPausaLunga, data.pomodoriPerSessione);
            })

    }, []);
  
    const handleSubmit = (e) => {
      e.preventDefault();

        const requestBody = {
            pomdoro: pomdoro,
            pausaCorta: pausaCorta,
            pausaLunga: pausaLunga,
            sessioni: numeroSessioni
        };
      
        fetch('api/v1/timer/impostazioni/aggiorna', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(readTimerData()) // aggiorna dati
    };
  
    return (
        <form className="settings-form" onSubmit={handleSubmit}>
        
            <div className='setting-div'>
                <label htmlFor="pomdoro">Durata pomodoro:</label>
                <input
                    type="number"
                    id="pomdoro"
                    value={pomdoro}
                    onChange={(e) => setPomdoro(parseInt(e.target.value))}
                    min="15"
                    max="60"
                    required
                />
            </div>
    
            <div className='setting-div'>
                <label htmlFor="pausa-corta">Duarata pausa corta:</label>
                <input
                    type="number"
                    id="pausa-corta"
                    value={pausaCorta}
                    onChange={(e) => setPausaCorta(parseInt(e.target.value))}
                    min="5"
                    max="15"
                    required
                />
            </div>

            <div className='setting-div'>
                <label htmlFor="pausaLunga">Durata pausa lunga:</label>
                <input
                    type="number"
                    id="pausaLunga"
                    value={pausaLunga}
                    onChange={(e) => setPausaLunga(parseInt(e.target.value))}
                    min="10"
                    max="30"
                    required
                />
            </div>

            <div className='setting-div'>
                <label htmlFor="numeroSessioni">Numero sessioni:</label>
                <input
                    type="number"
                    id="numeroSessioni"
                    value={numeroSessioni}
                    onChange={(e) => setNumeroSessioni(parseInt(e.target.value))}
                    min="2"
                    max="6"
                    required
                />
            </div>
    
            <button type="submit">Save</button>
        </form>
    );
}