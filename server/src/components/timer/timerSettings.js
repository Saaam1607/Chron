//let prova = 0.05;

class Settings {
    durataPomodoro = 25;
    durataPausaCorta = 5;
    durataPausaLunga = 15;
    pomodoriPerSessione = 4;

    getSettingsData() {
        return {
            durataPomodoro: this.durataPomodoro,
            durataPausaCorta: this.durataPausaCorta,
            durataPausaLunga: this.durataPausaLunga,
            pomodoriPerSessione: this.pomodoriPerSessione
        }
    }
    
    setDurataPomodoro(durata) {
        this.durataPomodoro = durata;
    }

    setDurataPausaCorta(durata) {
        this.durataPausaCorta = durata;
    }

    setDurataPausaLunga(durata) {
        this.durataPausaLunga = durata;
    }

    setPomodoriPerSessione(numero) {
        this.pomodoriPerSessione = numero;
    }

}

settings = new Settings();

module.exports = settings;