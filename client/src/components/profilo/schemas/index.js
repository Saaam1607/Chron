import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const basicSchema = yup.object().shape({
    // email: yup
    //     .string("Formato non valido")
    //     .email("Email non valida").
    //     required(),
    // password: yup
    //     .string("Formato non valido")
    //     .min(8, "Utilizza almeno 8 caratteri")
    //     .matches(passwordRules, { message: "Inserisci almeno una lattera maisucola, minuscola e un numero" })
    //     .required(),
    // username: yup
    //     .string("Formato non valido")
    //     .min(4, "Utilizza almeno 4 caratteri")
});