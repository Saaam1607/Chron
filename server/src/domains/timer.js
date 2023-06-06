const express = require("express")
const session = require('express-session')
const cookieParser = require("cookie-parser");
const DefaultSettings = require("./../components/timer/timerSettings")
const router = express.Router()


const Fase = Object.freeze({ 
    Pomodoro: 0,
    PausaCorta: 1,
    PausaLunga: 2,
});



function getDurataFromSettings(fase, impostazioni){
    switch (fase) {
        case Fase.Pomodoro:
            return impostazioni.durataPomodoro;
        case Fase.PausaCorta:
            return impostazioni.durataPausaCorta;
        case Fase.PausaLunga:
            return impostazioni.durataPausaLunga;
        default:
            return 0;
    }
}



router.use(cookieParser());
router.use(
    session({
        secret: "secret_key_for_timer_settings",
    })
);



router.get("/stato", (req, res) => {

    try{
        if (!req.session.impostazioni || req.session.streak == undefined || req.session.fase == undefined){ // se non c'è una sessione la creo
            
            // creazione con impostazioni di default
            req.session.impostazioni = DefaultSettings.getDefaultSettings();
            req.session.streak = 0;
            req.session.fase = 0;
            req.session.save();

            // ritorna lo stato iniziale
            res.status(200).json({success: true, fase: 0, durata: DefaultSettings.getDefaultDurataPomodoro()})

        } else{

            const durata = getDurataFromSettings(req.session.fase, req.session.impostazioni);

            res.status(200).json({success: true, fase: req.session.fase, durata: durata})
            
        }
    } catch (err){
        console.log(err)
        res.status(500).json({success: false, message: "Errore durante la lettura dello stato del timer"})
    }
       
})



router.put("/end", (req, res) => {

    try {

        if (req.session.fase != undefined){ // forse qui vanno controlli più completi
            
            // controlli su input
            if (req.body.fase < 0 || req.body.fase > 2){
                return res.status(400).json({success: false, message: "Errore, input non validi"})
            } else{

                switch (req.session.fase) {
                    case Fase.Pomodoro: //se è la fine di un pomodoro
                        req.session.streak++;
                        if (req.session.streak == req.session.impostazioni.pomodoriPerSessione) { //se le sessioni sono finite
                            req.session.streak = 0;
                            req.session.fase = Fase.PausaLunga;
                        } else {
                            req.session.fase = Fase.PausaCorta;
                        }
                        break;
                    case Fase.PausaCorta: //se è la fine di una pausa corta
                        req.session.fase = Fase.Pomodoro;
                        break;
                    case Fase.PausaLunga: //se è la fine di una pausa lunga
                        req.session.fase = Fase.Pomodoro;
                        break;
                    default:
                        break;
                }

                return res.status(200).json({
                    success: true,
                    fase: req.session.fase,
                    durata: getDurataFromSettings(req.session.fase, req.session.impostazioni)
                })
            }
        } else{
            return res.status(404).json({success: false, message: "Errore, sessione mancante o non valida"})
        }

    } catch (err){
        res.status(500).json({success: false, message: "Errore durante l'aggiornamento del timer"})
    }
})



router.get("/impostazioni", (req, res) => {

    try {

        if (!req.session.impostazioni){ // se c'è un dato nella sessione lo uso
            res.status(404).json({success: false, message: "Errore, impostazioni della sessione mancanti o non valide"})
        } else{
            res.status(200).json({
                success: true, 
                durataPomodoro: req.session.impostazioni.durataPomodoro,
                durataPausaCorta: req.session.impostazioni.durataPausaCorta,
                durataPausaLunga: req.session.impostazioni.durataPausaLunga,
                pomodoriPerSessione: req.session.impostazioni.pomodoriPerSessione
            })
        }

    } catch (err){
        res.status(500).json({success: false, message: "Errore nella lettura delle impostazioni"})
    }
})

router.put("/impostazioni", async (req, res) => {
    try {

        const pomdoro = parseInt(req.body.pomdoro);
        const pausaCorta = parseInt(req.body.pausaCorta);
        const pausaLunga = parseInt(req.body.pausaLunga);
        const sessioni = parseInt(req.body.sessioni);

        if (
            // controllo che non sia Nan
            isNaN(pomdoro) ||
            isNaN(pausaCorta) ||
            isNaN(pausaLunga) ||
            isNaN(sessioni) ||

            // coontrollo sul range di valore
            (pomdoro < 15 || pomdoro > 60) ||
            (pausaCorta < 5 || pausaCorta > 15) ||
            (pausaLunga < 10 || pausaLunga > 30) ||
            (sessioni < 2 || sessioni > 6)
        ){
            return res.status(400).json({success: false, message: "Errore, input non validi"})
        }

        req.session.impostazioni = {durataPomodoro: pomdoro, durataPausaCorta: pausaCorta, durataPausaLunga: pausaLunga, pomodoriPerSessione: sessioni}
        res.status(200).json({success: true})

    } catch (error) {
        res.status(500).json({success: false, message: "Errore durante la modifica delle impostazioni"})
    }
})





module.exports = router