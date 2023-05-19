import { useState, useEffect } from 'react';
import './Timer.css';
import SessionForm from "./SessionForm"
import TimerSettings from "./TimerSettings"
const tokenManager = require('../tokenManager/cookieManager');


export default function Timer(){

    const [time, setTime] = useState(1);
    const [timerState, setTimerState] = useState("stoppato");
    const [fase, setFase] = useState(0);
    const [message, setMessage] = useState("");

    const [settingsClicked, setSettingsClicked] = useState(false);
    const [sessionFormClicked, setsessionFormClicked] = useState(false);
  
    const readTimerData = async () =>{

        // fetching data
        await fetch("api/v1/timer/stato", {
            method: "GET",
            headers: tokenManager.generateHeader()
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 500){
                    throw new Error("Errore durante la lettura dello stato del timer");
                }
            })
                .then(data => {
                    
                    // setting up timer
                    setTime(data.durata * 60)
                    setFase(data.fase)

                    // setting up message
                    switch (data.fase) {
                        case 0:
                            setMessage("TIME TO GET FOCUSED!");
                            break;
                        case 1:
                            setMessage("TIME TO TAKE A SHORT BREAK!");
                            break;
                        case 2:
                            setMessage("TIME TO TAKE A LONG BREAK!");
                            break;
                            default:
                            break;
                    };

                })
                .catch(error => {
                    alert(error.message);
                })
    }

    const fetchData = async () =>{
        const requestBody = {
          time: time,
          fase: fase,
          stato: timerState
        };
      
        await fetch('api/v1/timer/end', {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
                if (response.ok) {
                } else if (response.status === 400){
                    throw new Error("Errore durante l'aggiornamento del timer");
                }
            })
                .then(data => {
                })
                .catch(error => {
                    alert(error.message);
                })
            
      };



    // at the beginning the data is read and setted up
    useEffect(() => {
        readTimerData()
    },[])

    // quando il timer viene fermato (o dall'utente o perchè è finito)
    useEffect(() => {
        if ((timerState == "stoppato")){
            fetchData()                    // aggiorna la fase (fase <- fase-successiva)
            readTimerData()                // aggiorna il timer (durata, fase, messaggio)
        }
    },[timerState])

    useEffect(() => {
      let interval = null;

      // timer avviato
      if (timerState == "avviato") {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime - 1)
        }, 1000);

      // timer fermo
      } else if (timerState != "avviato") {
        clearInterval(interval);
      }
      if (time <= 0){
        setTimerState("stoppato")
      }
  
      return () => clearInterval(interval);
    }, [timerState, time]);

    let minuti = (time - (time % 60)) / 60;
    let secondi = time - minuti * 60;

    return (
        <div className="Timer">
            <div className="timer-container">
                <h1 style={fase == 0 ? {color: "rgb(35, 156, 204)"} : {color: "green"}}>{message}</h1>
                <div className="minutes-seconds">
                    <span>{minuti < 10 ? "0" + minuti: minuti}:</span>
                    <span>{secondi < 10 ? "0" + secondi: secondi}</span>
                </div>
        
                <div className="timer-buttons-div">
                        {/* PLAY */}
                        {(timerState != "avviato") &&
                            <span className="icona">
                                <i
                                    className="bi bi-play-circle-fill"
                                    title="START"
                                    onClick={() => setTimerState("avviato")}
                                ></i>
                            </span>
                        }

                        {/* PAUSE */}
                        {(timerState == "avviato") &&
                            <span className="icona">
                                <i
                                    className="bi bi-pause-circle-fill"
                                    title="SUSPEND"
                                    onClick={() => setTimerState("sospeso")}
                                ></i>
                        </span>
                        }

                        {/* STOP */}
                        <span className="icona">
                            <i
                                className="bi bi-stop-circle-fill"
                                title="STOP"
                                onClick={() => setTimerState("stoppato")}
                            ></i>
                        </span>

                        <span className="icona" >
                            <i
                                className="bi bi-plus-circle-fill"
                                title="ADD TIME MANUALLY"
                                onClick={() =>{
                                    if (timerState == "stoppato") {
                                        setsessionFormClicked(!sessionFormClicked)
                                        setSettingsClicked(false)
                                    } else{
                                        alert("Prima di aggiungere sessioni manualmente devi fermare il timer!")
                                    }
                                }}
                                style={{color: (sessionFormClicked) ? 'rgb(27, 123, 161)' : 'rgb(35, 156, 204)'}}
                            ></i>
                        </span>

                        <span className="icona" >
                            <i
                                className="bi bi-gear-fill"
                                title="SETTINGS"
                                onClick={() =>{
                                    if (timerState == "stoppato") {
                                        setSettingsClicked(!settingsClicked)
                                        setsessionFormClicked(false)
                                    } else{
                                        alert("Prima di cambiare le impostazioni devi fermare il timer!")
                                    }
                                }} 
                                style={{color: (settingsClicked) ? 'rgb(93, 123, 134)' : 'rgb(139, 148, 151)'}}
                            ></i>
                        </span>

                </div>

                {/* <SessionForm /> */}
                {settingsClicked && <TimerSettings readTimerData={readTimerData} settingsClicked={settingsClicked} setSettingsClicked={setSettingsClicked}/>}

                {/* <SessionForm /> */}
                {sessionFormClicked && <SessionForm sessionFromClicked={sessionFormClicked} setsessionFromClicked={setsessionFormClicked}/>}

            </div>

            
        </div>
    );
}