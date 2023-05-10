import { useState, useEffect } from 'react';
import './Timer.css';

export default function Timer(){

    const [time, setTime] = useState(1);
    const [timerState, setTimerState] = useState(false);
    const [message, setMessage] = useState("");
  
    const readTimerData = async () =>{
      await fetch("api/v1/timer/stato", {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setTime(data.durata * 60)
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
      await fetch("api/v1/timer/end", {method: 'PUT'})
    }

    useEffect(() => {
      let interval = null;
      // timer avviato
      if (timerState) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime - 1)
        }, 1000);
      // timer fermo
      } else if (!timerState) {
        clearInterval(interval);
      }
      if (time <= 0){
        //console.log('timer finito')
        setTimerState(false)
      }
  
      return () => clearInterval(interval);
    }, [timerState, time]);

    useEffect(() => {
      readTimerData()
      console.log("time")
    },[])

    useEffect(() => {
      if (!timerState && time <= 0){
        console.log(time)
        fetchData()
        readTimerData()
      }
      
    },[timerState])

    let minuti = (time - (time % 60)) / 60;
    let secondi = time - minuti * 60;



    // disabled={ user.role === 'Student' ? true : false }
  
    return (
      <div className="Timer">
        <h1 style={message == "TIME TO GET FOCUSED!" ? {color: "rgb(35, 156, 204)"} :  {color: "green"}}>{message}</h1>
        <div className="minutes-seconds">
          <span>{minuti < 10 ? "0" + minuti: minuti}:</span>
          <span>{secondi < 10 ? "0" + secondi: secondi}</span>
        </div>
  
        <div className="buttons">
          <div className='timer-buttons'>
            {!timerState &&
              <span className="icona"onClick={() => setTimerState(true)}>
                <i className="bi bi-play-circle-fill" title="START"></i>
              </span>
              }
            {timerState &&
              <span className="icona" onClick={() => setTimerState(false)}>
                <i className="bi bi-pause-circle-fill" title="SUSPEND"></i>
              </span>
            }
            <span className="icona" onClick={() => {
              setTimerState(false)
              setTime(25 * 60)
            }}>
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