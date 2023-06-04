import * as yup from 'yup';

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Inserisci la nuova password')
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .matches(passwordRules, 'La password deve contenere almeno una lettera maiuscola, una lettera minuscola e un numero'),
  confirmPassword: yup
    .string()
    .required('Conferma la password')
    .oneOf([yup.ref('password')], 'Le password non corrispondono'),
});