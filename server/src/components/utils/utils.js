class Data {
    constructor() {
        const dataCorrente = new Date();
        this.giorno = dataCorrente.getDate();
        this.mese = dataCorrente.getMonth() + 1;
        this.anno = dataCorrente.getFullYear();
    }
    
    inizializzaDataCorrente(giorno, mese, anno) {
        this.giorno = giorno;
        this.mese = mese;
        this.anno = anno;
    
    }
}

class Tempo {
    constructor() {
        this.ore = 0;
        this.minuti = 0;
    }

    aggiungiTempo(minuti) {
        const totaleMinuti = this.minuti + minuti;
        this.ore += Math.floor(totaleMinuti / 60);
        this.minuti = totaleMinuti % 60;
    }
}

class Sessione {
    constructor(data, tempo, idUtente) {
        this.data = data;
        this.tempo = tempo;
        this.idUtente = idUtente;
}
}

module.exports = {
    Data,
    Tempo,
    Sessione
};