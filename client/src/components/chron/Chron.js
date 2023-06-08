import React, {useEffect, useState} from 'react'
import "./Chron.css"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
  import { Bar, Pie } from 'react-chartjs-2';
  import CookieManager from'../tokenManager/cookieManager';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

  const options = { 
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };
  
  const optionsPie = { //no mouseover label
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: false,
    },
  };


function Chron() {
    //auth
    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);
    //variabili per il grafico
    const [minuti, setMinuti] = React.useState([0, 0]);
    const [dataSessione, setDataSessione] = React.useState(["", ""]);
    const [tempoTotale, setTempoTotale] = React.useState(0);
    const [media, setMedia] = React.useState(0);
    const [tasso, setTasso] = React.useState (0);
    const [isMonth, setIsMonth] = React.useState("true");
    const [arrowclick, setArrowclick] = React.useState(0);

    //function per ottenere i dati dal db
  function fetchData(){
        fetch( `/api/v1/grafici?arrowClick=${arrowclick}&isMonth=${isMonth}`, {method: "GET", headers: CookieManager.generateHeader() })
        .then(response => {
          //console.log(response);
            if (response.ok) {
              return response.json();
            } else if (response.status === 400){
            throw new Error(response.statusText);
            } else if (response.status === 401){
            throw new Error(response.statusText);
            } else if (response.status === 500){
            throw new Error(response.statusText);
            }
          })
        .then(data => {
          if (data !== undefined) {        
          let date = [];
          let min = [];
          data.sessions.sessioni.forEach(element => {
            date.push(element.data);
            min.push(element.minuti);
          });
          setMinuti(min);
          setDataSessione(date);
          setTempoTotale(data.sessions.tempoTot);
          setMedia(data.sessions.media);
          setTasso(data.sessions.tasso);
        }
        })
        .catch((error) => {
          console.log('Errore durante la richiesta:', error.message);
          alert(error.message)
        });
      }
      
      useEffect(() => {
        fetchData();
      }, [arrowclick, isMonth]);

      const data = {
          labels: dataSessione,
          datasets: [
              {
                label: 'Minuti',
                data: minuti,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
          ]
      };

      const dataPie = {
        //grafico diverso se tasso è positivo o negativo
        labels: tasso < 0 ?['Percentuale di produttività in meno']:['Percentuale di produttività in più'],
        datasets: [
          {
            //visualizzare il tasso negativo come unico dato del grafico
            data: [tasso, Math.abs(tasso)>100 ? 0 : 100-Math.abs(tasso)],
            
            //con il tasso negativo il grafico è rosso, altrimenti verde
            backgroundColor: tasso<0 ? ['rgba(255, 99, 132, 0.5)', 'rgba(255, 99, 132, 0)'] : ['rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 0)'],
            borderColor: tasso<0 ? ['rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0)'] : ['rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 1)'],
            borderWidth: 1
          }
      ]
    };

  return (
  <>
      {isAuthenticated ? (
          <div className='analitycs'>
            <p id='titolo'>Analisi della produttività</p>
            <p id='mex'>Non Mollare!</p>
           <div className='graphic'>     
              <div className='chart'>
                <div className='buttondiv'>
                <button className= "button" onClick={() => {setIsMonth(true); setArrowclick (0)}}>Mensile</button>
                <button className= "button" onClick={() => {setIsMonth(false); setArrowclick (0)}}>Settimanale</button> <br/>
                </div>
                <div className='buttondiv'>
                <button onClick={() => setArrowclick(prev=> prev-1)}> {"<"} </button>
                {isMonth ? `Mese da ${dataSessione[0]} al ${dataSessione[dataSessione.length-1]}` : `Settimana da ${dataSessione[0]} al ${dataSessione[dataSessione.length-1]}`}
                <button onClick={() => setArrowclick(prev=> prev+1)}> {">"} </button>
                </div>
                <Bar data={data} options={options}/>
              </div>
            <div className = 'stats'>
              <p>
                tempototale {isMonth? "mensile":"settimanale"} = {Math.floor(tempoTotale/60)}:{tempoTotale%60} <br/>
                media {isMonth? "mensile":"settimanale"}= {Math.floor(media/60)}:{media%60} <br/> 
                rispetto alla precedente = {tasso}%
              </p>
              <Pie data={dataPie} options={optionsPie} />
            </div>
          </div>
          
        </div>      
      ) : (//al centro se non autenticato
          <div className='unauthorized'>
              <p>Utente non autenticato. Accedi per visualizzare i grafici.</p>
              <a href="/profilo">Pagina di autenticazione</a>
          </div>
      )}
  </>
  )
}
export default Chron