const express = require("express")
const impostazioni = require("./../components/timer/timerSettings")
const router = express.Router()

const Fase = Object.freeze({ 
    Pomodoro: 0,
    PausaCorta: 1,
    PausaLunga: 2,
});
/*
    Cosa deve ricevere il client?
        - durata timer
        - stato: pausa corta, lunga, pomodoro
*/
/*
    Ricevo fine di un timer
    è la fine di un pomodoro?
        - incremento streak
        - ho finito le sessioni?
            - reset streak
            - pausa lunga
    è la fine di una pausa corta?
        - pomodoro
    è la fine di una pausa lunga?
        - pomodoro
*/
class Timer {
    constructor() {
        this.fase = Fase.Pomodoro;
        this.streak = 0;
        this.durata = 25;
    }
    stampa(){
        console.log(`Fase: ${this.fase}, Streak: ${this.streak}, Durata: ${this.durata}`)
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
    timer.aggiorna();
    timer.stampa();
    res.json({fase: timer.fase, durata: timer.durata})
})


module.exports = router