const express = require("express")
const impostazioni = require("./../components/timer/timerSettings")
const { Data, Tempo, Sessione } = require('../components/utils/utils');
const GestoreDB = require("../components/gestoreDB/gestoreDB")
const router = express.Router()

const Fase = Object.freeze({ 
    Pomodoro: 0,
    PausaCorta: 1,
    PausaLunga: 2,
});

class Timer {
    constructor() {
        this.fase = Fase.Pomodoro;
        this.streak = 0;
        this.durata = impostazioni.durataPomodoro;
    }
    stampa(){
        console.log(`Fase: ${this.fase}, Streak: ${this.streak}, Durata: ${this.durata}`)
    }
    aggiornaImpostazioni(){
        this.durata = impostazioni.durataPomodoro;
    }
    aggiorna(){
        switch (this.fase) {
            case Fase.Pomodoro: //se è la fine di un pomodoro
                    this.streak++;
                    if (this.streak == impostazioni.pomodoriPerSessione) { //se le sessioni sono finite
                        this.streak = 0;
                        this.fase = Fase.PausaLunga;
                        this.durata = impostazioni.durataPausaLunga;
                    } else {
                        this.fase = Fase.PausaCorta;
                        this.durata = impostazioni.durataPausaCorta;
                    }
                break;
            case Fase.PausaCorta: //se è la fine di una pausa corta
                this.fase = Fase.Pomodoro;
                this.durata = impostazioni.durataPomodoro;
                break;
            case Fase.PausaLunga: //se è la fine di una pausa lunga
                this.fase = Fase.Pomodoro;
                this.durata = impostazioni.durataPomodoro;
                break;
            default:
                break;
        }
    }
}

timer = new Timer();

router.get("/stato", (req, res) => {
    if (timer.fase != undefined && timer.durata){
        res.status(200).json({fase: timer.fase, durata: timer.durata})
    } else{
        res.status(500).json()
    }
    
})

// DA INTEGRARE CON L'AGGIUNTA AUTO
router.put("/end", (req, res) => {

    // controlli su input
    if (req.body.fase < 0 || req.body.fase > 2 || req.body.time < 0 || req.body.time > 60 * 60){
        return res.status(400).json()
    }

    if (req.body.time <= 0 || (((req.body.fase == 1) || req.body.fase == 2) && req.body.stato == "stoppato")){
        timer.aggiorna();
        //console.log("TEMPO RIMANENTE: " + this.durata * 60 - req.body.time)
    }
    res.status(200).json({fase: timer.fase, durata: timer.durata})
})

router.get("/impostazioni", (req, res) => {
    const data = impostazioni.getSettingsData()
    if (data){
        res.status(200).json(data)
    } else{
        res.status(500).json({message: "Errore"})
    }
})

router.put("/impostazioni/aggiorna", async (req, res) => {
    try {
        impostazioni.setDurataPomodoro(req.body.pomdoro);
        impostazioni.setDurataPausaCorta(req.body.pausaCorta);
        impostazioni.setDurataPausaLunga(req.body.pausaLunga);
        impostazioni.setPomodoriPerSessione(req.body.sessioni);
        timer.aggiornaImpostazioni();
        res.status(200).json()
    } catch (error) {
        res.status(500).json()
    }
})



router.put('/salva-sessione', (req, res) => {

    const minuti = req.body.minuti;
    const date = new Date(req.body.date);

    if (!minuti || typeof minuti !== 'number' || !date || isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Parametro "minuti" o "date" mancante o non valido.' });
    }

    const tempo = new Tempo();
    tempo.aggiungiTempo(minuti);

    const sessione = new Sessione(new Data(date.getDate(), date.getMonth() + 1,date.getFullYear()), tempo, req.id);

    GestoreDB.salvaSessione(sessione)
        .then((result) => {
            res.status(result.stato).json({ success: true, message: 'Sessione salvata con successo.' });
        })
        .catch(error => {
            console.error(`Non è stato possibile salvare la sessione. ${error.message}`);
            res.status(500).json({ success: false, message: error.message });
        });
});

module.exports = router