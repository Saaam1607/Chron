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

router.get("/", (req, res) => {
    res.send("Timer")
})

router.get("/stato", (req, res) => {
    res.json({fase: timer.fase, durata: timer.durata})
})

router.put("/end", (req, res) => {
    // console.log(req.body)

    if (req.body.time <= 0 || (((req.body.fase == 1) || req.body.fase == 2) && req.body.stato == "stoppato")){
        timer.aggiorna();
        console.log("TEMPO RIMANENTE: " + this.durata * 60 - req.body.time)
    }
    res.json({fase: timer.fase, durata: timer.durata})
})

router.get("/impostazioni", (req, res) => {
    const data = impostazioni.getSettingsData()
    res.json(data)
})

router.put("/impostazioni/aggiorna", (req, res) => {
    impostazioni.setDurataPomodoro(req.body.pomdoro);
    impostazioni.setDurataPausaCorta(req.body.pausaCorta);
    impostazioni.setDurataPausaLunga(req.body.pausaLunga);
    impostazioni.setPomodoriPerSessione(req.body.sessioni);
    res.json({message: "Ciao"})
    timer.aggiornaImpostazioni();
})



router.put('/salva-sessione', (req, res) => {
    const minuti = req.body.minuti;

    // Validazione dell'input
    if (!minuti || typeof minuti !== 'number') {
        return res.status(400).json({ success: false, message: 'Parametro "minuti" mancante o non valido.' });
    }

    const tempo = new Tempo();
    tempo.aggiungiTempo(minuti);
    const sessione = new Sessione(new Data(), tempo, req.id);

    GestoreDB.salvaSessione(sessione)
        .then(() => {
            res.status(201).json({ success: true, message: 'Sessione salvata con successo.' });
        })
        .catch(error => {
            console.error(`Non è stato possibile salvare la sessione. ${error.message}`);
            res.status(500).json({ success: false, message: error.message });
        });
});

module.exports = router