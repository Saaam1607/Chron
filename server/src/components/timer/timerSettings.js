module.exports = class DefaultSettings {

    static getDefaultDurataPomodoro() {
        return 25;
    }

    static getDefaultSettings() {
        return {
            durataPomodoro: 25,
            durataPausaCorta: 5,
            durataPausaLunga: 15,
            pomodoriPerSessione: 4
        }
    }

}