// //fatto su modello listaTask
const  GestoreDB  = require('../gestoreDB/gestoreDB');

class ListaSessioni {
  constructor(ID_utente) {
    this.ID_utente = ID_utente;
    this.ListaSessioni = [];
  }

  async leggiStorico(intervalloDesiderato, isMonth) {
    let inizio;
    let fine;
    let numeroGiorni;
    let tasso;
    this.ListaSessioni.splice(0, this.ListaSessioni.length);
    try {   
      //controllo che inttervallo sia un numero e isMonth sia un booleano
      if (isNaN(intervalloDesiderato) || (isMonth !== "true" && isMonth !== "false")) {
        throw new Error("Intervallo non valido");
      } else {
          let oggi = new Date();
          if (isMonth === "true"){//date mensili
            //aggiorno il mese di oggi in base all'intervallo desiderato
            let intervallo = (12 + parseInt(intervalloDesiderato % 12))%12; //in modo da avere ciclicità positiva
            let mese = (oggi.getMonth() + intervallo)%12;                   //in modo da avere solo mesi positivi 
            //set degli anni
            let intervalloAnni = Math.floor((parseInt(intervalloDesiderato)+oggi.getMonth())/12); //cambio anno quando sforo i 12 mesi
            oggi.setFullYear(oggi.getFullYear() + intervalloAnni);
            let year = oggi.getFullYear();
            mese = mese +1;
            if(mese < 10){mese = "0" + mese;}
            let fineMese = new Date(year, mese, 0);
            fineMese.setHours(23, 59, 59, 0);     
            let inizioMese = new Date(year + "-" + mese + "-01");
            //setto le date da passare alla query
            inizio = inizioMese;
            fine = fineMese;
            numeroGiorni = fine.getDate();
          }else{//date settimanali
            let lunedi = new Date(oggi.setDate(oggi.getDate() - oggi.getDay() + 1 + intervalloDesiderato * 7));
            lunedi.setHours(2, 0, 0, 0); //fuso orario di 2 ore
            let domenica = new Date(oggi.setDate(oggi.getDate() - oggi.getDay() + 7));
            domenica.setHours(23, 59, 59, 0);;
            //setto le date da passare alla query
            inizio = lunedi;
            fine = domenica;
            numeroGiorni = 7;
          }
            const sessions = await GestoreDB.leggiStorico(this.ID_utente, inizio, fine);
            //ciclo per ogni giorno del periodo selezionato 
            let data = new Date(inizio);
            for (let i = 0; i < numeroGiorni; i++) {
            let dataString = data.toISOString().slice(0, 10);
              //tutto sto cinema perchè marzo prende 2 volte il 26-03
              if (i === 25 && inizio.getMonth() === 2 && inizio.getFullYear() <= new Date().getFullYear()){
                //console.log ("avariato m'arzo")
                data.setDate(data.getDate() + 1); //forzo il 27 al ciclo 26esimo
              }
              data.setDate(data.getDate() + 1);
              let minuti = 0;
              //ciclo per ogni sessione del giorno
              sessions.forEach((sessione) => {
                if (sessione.data.toISOString().slice(0, 10) === dataString) {
                  minuti += sessione.minuti;
                }
              });
              this.ListaSessioni.push({ data: dataString, minuti: minuti });
            }
            let tempoTot = await this.calolaTempoSessione();
            let media = await this.calcolaMediaSessione();
            if (isMonth === "true") {
              tasso = await this.calcolaTassoMese(inizio, tempoTot);
            } else {
              tasso = await this.calcolaTassoSettimana(inizio, tempoTot);
            }
            return {sessioni: this.ListaSessioni, media: Math.round(media), tempoTot: tempoTot, tasso: tasso.toFixed(2)};
      }
      }catch (error) {
      // Gestisci eventuali errori
      console.error(`Errore durante la lettura delle sessioni per l'utente ${this.ID_utente}: ${error}`);
      throw error;
    }
  }

  async calolaTempoSessione() { //revisionata da calcolatemposettimana
    //somma tutti i minuti di tutte le sessioni
    let minutiTot = 0;
    this.ListaSessioni.forEach((sessione) => {
      minutiTot += sessione.minuti;
    }
    );
    return minutiTot;
  }
  async calcolaMediaSessione() {//revisonata da Settimana
    //somma tutti i minuti di tutte le sessioni diviso il numero di sessioni
    let minutiTot = 0;
    this.ListaSessioni.forEach((sessione) => {
      minutiTot += sessione.minuti;
    }
    );
    return minutiTot / this.ListaSessioni.length;
  }
  async calcolaTassoSettimana(inizioSettCorr, tempoTot) {
      let prevDomenica = new Date(inizioSettCorr.setDate(inizioSettCorr.getDate() - 1));
      prevDomenica.setHours(23,59,59,0);
      let prevLunedi = new Date(inizioSettCorr.setDate(inizioSettCorr.getDate() - 5));
      prevLunedi.setHours(0,0,0,0);
      const sessions = await GestoreDB.leggiStorico(this.ID_utente, prevLunedi, prevDomenica);
      let minutiPrevTot = 0;
      sessions.forEach((sessione) =>{
      minutiPrevTot += sessione.minuti;
    });
    if (minutiPrevTot===0 ){
      if (tempoTot===0){return 0}
      return 100
    }
    //if (minutiPrevTot===tempoTot){return 0}
    return ((tempoTot-minutiPrevTot)/minutiPrevTot)*100;
  }

  async calcolaTassoMese(inizio, tempoTot) {
    let fineMese = new Date (inizio.setDate(inizio.getDate()-1));
    fineMese.setHours(23,59,59,0);
    let mese = fineMese.getMonth();
    if (mese < 10) mese = "0" + mese;
    let inizioMese = new Date (inizio.setDate(1));
    const sessions = await GestoreDB.leggiStorico(this.ID_utente, inizioMese, fineMese);
    let minutiPrevTot = 0;
    sessions.forEach((sessione) =>{
      minutiPrevTot += sessione.minuti;
    })
    if (minutiPrevTot===0 ){
      if (tempoTot===0){return 0;}
      return 100;
    }

    //return (tempoTot/minutiPrevTot)*100;
    return (tempoTot-minutiPrevTot)/minutiPrevTot*100;
  }
}
module.exports = ListaSessioni;