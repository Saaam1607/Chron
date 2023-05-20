import { useState, useEffect } from 'react';
import './Timer.css';
import SessionForm from './SessionForm';
import TimerSettings from "./TimerSettings"
import { handleAlert } from '../alert/Alert';
//const tokenManager = require('../tokenManager/cookieManager');
const tokenManager = require('../tokenManager/cookieManager');


export default function Timer(){

    const [time, setTime] = useState(1);
    const [timerState, setTimerState] = useState("stopped");
    const [fase, setFase] = useState(0);
    const [message, setMessage] = useState("");

    const [settingsClicked, setSettingsClicked] = useState(false);
    const [sessionFormClicked, setsessionFormClicked] = useState(false);
  
    const [soundUP, setSoundUP] = useState(true);

    const readTimerData = async () =>{
      await fetch("api/v1/timer/stato", {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        //console.log(data)

        // setting up timer
        setTime(data.durata * 60)
        setFase(data.fase)

        // setting up message
        switch (data.fase) {
          case 0:
            setMessage("TIME TO GET FOCUSED!")
            break;
          case 1:
            setMessage("TIME TO TAKE A SHORT BREAK!")
            break;
          case 2:
            setMessage("TIME TO TAKE A LONG BREAK!")
            break;
          default:
            break;
        }
      })
    }

    const fetchData = async () =>{
      await fetch(`api/v1/timer/end?time=${time}&fase=${fase}&stato=${timerState}`, {method: 'PUT'})
    }

    // at the beginning the data is read and setted up
      useEffect(() => {
      readTimerData()
    },[])

    // quando il timer viene fermato (o dall'utente o perchè è finito)
    useEffect(() => {
        if ((timerState == "stoppato")){
            fetchData()                    // aggiorna la fase (fase <- fase-successiva)
            readTimerData()                // aggiorna il timer (durata, fase, messaggio)
            if (time == 0 && soundUP){
                handleAlert()               // lancia l'alert
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
                <div >
                <button 
                style={soundUP ? {backgroundColor: "rgb(35, 156, 204)",height: "60px"} : {backgroundColor: "red",height: "60px"}}
                className="btn btn-primary btn-sm"
                onClick={() => setSoundUP(!soundUP)}> {soundUP ? "NOTIFICA ON" : "NOTIFICA OFF"}</button>
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
              <span className="icona" onClick={() => setTimerState("sospeso")}>
                <i className="bi bi-pause-circle-fill" title="SUSPEND"></i>
              </span>
            }

            {/* STOP */}
            <span className="icona" onClick={() => setTimerState("stoppato")}>
              <i className="bi bi-stop-circle-fill" title="STOP"></i>
            </span>

          </div>
          <div className='add-buttons'>
            <span className="icona">
              <i className="bi bi-plus-circle-fill" title="ADD TIME MANUALLY"></i>
            </span>
          </div>
        </div>
      </div>
    );
}