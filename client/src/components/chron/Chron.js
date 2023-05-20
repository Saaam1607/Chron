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


function Chron() {

    const [minuti, setMinuti] = React.useState([5, 10]);
    const [datachanged, setDatachanged] = React.useState(["2020-10-10", "2020-10-11"]);

    const fetchData = () => {
        try {
        fetch( "/api/v1/grafici/", {method: 'GET'})
        .then(response => {
            if (response.ok) {
              //console.log(response.json());
              return response.json();
            } else if (response.status === 400){
              throw new Error("Errore durante l'aggiornamento dei dati");
            }
          })
        .then(info => {
            //update minuti
            if (info != undefined) {
              setMinuti(info.minutiArray);
              //update datachanged
              setDatachanged(info.dateArrayUnique); 
            } 
        }
        )

        } catch (error) {
          // Gestisci l'errore qui
          console.log('Errore durante la richiesta:', error.message);
        }
      }
      
      useEffect(() => {
        fetchData();
        }, []);

        const data = {
            labels: datachanged,
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
    <div>
      <Bar data={data} options={options} />
    </div>
  )
}


export default Chron
