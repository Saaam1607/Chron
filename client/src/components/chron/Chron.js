import React, {useEffect, useState} from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Chart',
      },
    },
  };
  
  const CookieManager = require("../tokenManager/cookieManager.js")  

function Chron() {
    //auth
    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);
    useEffect(() => {
        setIsAuthenticated(CookieManager.generateHeader() !== undefined);
    }, [CookieManager.generateHeader()]);

    //variabili per il grafico
    const [minuti, setMinuti] = React.useState([0, 0]);
    const [dataSessione, setDataSessione] = React.useState(["", ""]);
    const [isMonth, setIsMonth] = React.useState("true");
    //const [tempototale, setTempototale] = React.useState(0);

    


    const fetchData = () => {
        try {
        fetch( "/api/v1/grafici/", {method: 'GET', headers: CookieManager.generateHeader()})
        .then(response => {
            if (response.ok) {
              //console.log(response.json());
              return response.json();
            } else if (response.status === 400){
              throw new Error("Errore durante l'aggiornamento dei dati");
            }
          })
        .then(info => {
        if (info != undefined) {
            
              //let tempototale = 0;
              
              //filtro la settimana o mese
              if (!isMonth){ 
                //ottengo il mese corrente
                let oggi = new Date()
                let meseOggi= oggi.getMonth() +1;
                let annoOggi = oggi.getFullYear();

                //conto i giorni del mese corrente
                let giorniMese = new Date(annoOggi, meseOggi, 0).getDate();

                //creo un array con le date del mese corrente
                let dateMensili = [];
                for (let i = 1; i <= giorniMese; i++){
                  dateMensili.push((new Date(annoOggi + "-" + meseOggi + "-" + i)).toISOString().slice(0,10));
                }
                
                let minTot = [];
                dateMensili.forEach((data) => {
                  let minData = 0;
                  info.sessions.forEach((sessione) => {
                      if(sessione.data.slice(0,10) === data){
                          minData += sessione.minuti;
                          //tempototale += sessione.minuti;
                      }
                  });
                  minTot.push(minData);
                })
                
                setDataSessione(dateMensili);
                setMinuti(minTot);
                //setTempototale(tempototale);
              }else{
                let oggi = new Date() ;
                let lunedi = new Date(oggi.setDate(oggi.getDate() - oggi.getDay()));

                //map to get the last 7 days
                let dateWeekly = [];
                for (let i = 0; i < 7; i++){
                  dateWeekly.push(new Date(lunedi.setDate(lunedi.getDate()+1)).toISOString().slice(0,10));
                }
                
                
                let minTot = [];
                dateWeekly.forEach((data) => {
                  let minData = 0;
                  info.sessions.forEach((sessione) => {
                      if(sessione.data.slice(0,10) === data){
                          minData += sessione.minuti;
                          //tempototale += sessione.minuti;
                      }
                  });
                  minTot.push(minData);
                })
                setDataSessione(dateWeekly);
                setMinuti(minTot); 
                //setTempototale(tempototale);
              }
            }
          }
        )

        } catch (error) {
          // Gestisci l'errore qui
          console.log('Errore durante la richiesta:', error.message);
        }
      }
      
      useEffect(() => {
        console.log(dataSessione)
        console.log(minuti)
        fetchData();
        }, [isMonth]);
        
        const data = {
            labels: dataSessione,
            datasets: [
                {
                label: 'Minuti',
                data: minuti,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                },
            ],
            };

  return (
    //grafico con grandezza responsive
          
      <div className="chart" style={{width: "70%", height: "70%"}}>
      <button onClick={() => setIsMonth(!isMonth)}>{isMonth ? "Settimanale" : "Mensile"}</button>
      <Bar data={data} options={options} />
      {/* tempototale = {tempototale} <br/> */}
      tempototale = {minuti.reduce((a, b) => a + b, 0)} <br/>
      media = {minuti.reduce((a, b) => a + b, 0) / minuti.length} 
      
      </div>

  )
}


export default Chron
