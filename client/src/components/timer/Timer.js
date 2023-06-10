import { useState, useEffect } from 'react';
import './Timer.css';
import SessionForm from "./SessionForm"
import TimerSettings from "./TimerSettings"
import { handleAlert } from '../alert/Alert';
import CookieManager from'../tokenManager/cookieManager';

let durata = 0;

export default function Timer(){

    const [time, setTime] = useState(1);
    const [timerState, setTimerState] = useState("inizializzato");
    const [fase, setFase] = useState(0);
    const [message, setMessage] = useState("");

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showSessionFormModal, setShowSessionFormModal] = useState(false);

    const [soundUP, setSoundUP] = useState(true);



    const handleOpenSettingsModal = () => {
        setShowSettingsModal(true);
    };
    
    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
    };

    const handleOpenSessionFormModal = () => {
        setShowSessionFormModal(true);
    };
    
    const handleCloseSessionFormModal = () => {
        setShowSessionFormModal(false);
    };



    const readTimerData = async () =>{

        // fetching data
        await fetch("api/v1/timer/stato", {
            method: "GET",
            headers: CookieManager.generateHeader()
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
                    durata = (data.durata * 60)
                    setFase(data.fase)

                    // setting up message
                    switch (data.fase) {
                        case 0:
                            setMessage("È ORA DI CONCENTRARSI!");
                            break;
                        case 1:
                            setMessage("È ORA DI PRENDERSI UNA BREVE PAUSA!");
                            break;
                        case 2:
                            setMessage("È ORA DI PRENDERSI UNA PAUSA LUNGA!");
                            break;
                        default:
                            break;
                    };

                })
                .catch(error => {
                    alert(error.message);
                })
    }



    const aggiornaTimer = async () =>{
        const requestBody = {
          fase: fase,
        };
      
        await fetch('api/v1/timer/fine', {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
                if (response.ok) {
                    // aggiornamento riuscito
                } else {
                    throw new Error("Errore durante l'aggiornamento del timer");
                }
            })
                .catch(error => {
                    alert(error.message);
                })
    };

    const salvaSessione = async (tempo) =>{
        fetch('api/v1/sessione/salva-sessione', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({minuti: (durata-time), date: new Date()})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 400){
                    throw new Error("Input non validi");
                } else if (response.status === 500){
                    throw new Error("Errore durante il salvataggio della sessione");
                }
            })
                .catch(error => {
                    alert(error.message);
                })
    }


    // at the beginning the data is read and setted up
    useEffect(() => {
        readTimerData()
    },[])

    // quando il timer viene fermato (o dall'utente o perchè è finito)
    useEffect(() => {
        if ((timerState == "stoppato")){

            if (time == 0 && fase == 0){ // se il timer è finito ed è pomodoro (time == 0 && fase == 0)
                aggiornaTimer() // aggiornaTimer()
                    .then(() => {
                        readTimerData()
                        if (CookieManager.getAuthToken() != false){
                            salvaSessione(durata-time)
                        }
                        if (soundUP){
                            handleAlert("OK", true, "success") // lancia l'alert
                        } else {
                            handleAlert("OK", false, "success")
                        }   
                    })
            }

            if (time != 0 && fase == 0){ // se il timer non è finito ed è pomodoro (time != 0 && fase == 0)
                readTimerData();
                if (CookieManager.getAuthToken() != false){
                    salvaSessione(durata-time)
                }
            }

            if (time == 0 && fase != 0){ // se il timer è finito ed è una pausa (time == 0 && fase != 0)
                aggiornaTimer()
                    .then(() => {
                        readTimerData()
                        if (soundUP){
                            handleAlert("OK", true, "success") // lancia l'alert
                        } else {
                            handleAlert("OK", false, "success")
                        } 
                    })
            }

            if (time != 0 && fase != 0){ // se il timer non è finito ed è pausa (time != 0 && fase != 0)
                aggiornaTimer()
                .then(() => {readTimerData()})
            }

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
                                    if (timerState == "stoppato" || timerState == "inizializzato") {
                                        setShowSessionFormModal(!showSessionFormModal)
                                        setShowSettingsModal(false)
                                    } else{
                                        alert("Prima di aggiungere sessioni manualmente devi fermare il timer!")
                                    }
                                }}
                                style={{color: (showSessionFormModal) ? 'rgb(27, 123, 161)' : 'rgb(35, 156, 204)'}}
                            ></i>
                        </span>

                        <span className="icona" >
                            <i
                                className="bi bi-gear-fill"
                                title="SETTINGS"
                                onClick={() =>{
                                    if (timerState == "stoppato" || timerState == "inizializzato") {
                                        setShowSettingsModal(!showSettingsModal)
                                        setShowSessionFormModal(false)
                                    } else{
                                        alert("Prima di cambiare le impostazioni devi fermare il timer!")
                                    }
                                }} 
                                style={{color: (showSettingsModal) ? 'rgb(93, 123, 134)' : 'rgb(139, 148, 151)'}}
                            ></i>
                        </span>

                        <span className="icona" >
                            <i
                                className="bi bi-volume-up-fill"
                                title="ALERT SOUND"
                                onClick={() =>{
                                    setSoundUP(!soundUP)}
                                } 
                                style={
                                    {color: (soundUP) ? 'rgb(27, 123, 161)' : 'rgb(207, 212, 213)'}
                                }
                            ></i>
                        </span>

                </div>

                {/* <SessionForm /> */}
                {showSettingsModal && <TimerSettings readTimerData={readTimerData} onClose={handleCloseSettingsModal}/>}

                {/* <SessionForm /> */}
                {showSessionFormModal && <SessionForm onClose={handleCloseSessionFormModal}/>}

            </div>

        </div>
    );
}