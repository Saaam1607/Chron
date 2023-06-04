import { useFormik } from 'formik';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import { basicSchema  } from '../schemas';
import CookieManager from'../../tokenManager/cookieManager';
import { handleAlert } from '../../alert/Alert';



function addErrorStyle(error, touched) {
    return {
        border: (error && touched) ? '2px solid red' : '',
    }
}



export default function PasswordModal({mostraPasswordModale, setMostraPasswordModale}){

    function modificaPassword(nuovaPassword){
        fetch('api/v1/profiloData/password', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({nuovaPassword: values.nuovaPassword, password: values.password})
        })
            .then(response => {

                if (response.ok) {
                    return
                } else if (response.status === 401){
                    return response.json().then(errorData => {
                        throw ({status: 401, errorData: errorData.message});
                    });
                } else if (response.status === 500){
                    return response.json().then(errorData => {
                        throw ({status: 500, errorData: errorData.message});
                    });
                }
            })
                .then(() => {
                    handleAlert("Password aggiornata", false, "success");
                    setMostraPasswordModale(false);
                })
                    .catch(error => {

                        let message = "Modifica non riuscita";
                        if (error.status === 401){
                            message ="Password inserita non corretta";
                        }

                        handleAlert(message, false, "error");
                        setMostraPasswordModale(false);
                    })
    }

    const onSubmit = async (values, actions) => {
        actions.resetForm();
        await modificaPassword(values.nuovaPassword);
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            nuovaPassword: '',
            password: '',
        },
        validationSchema: basicSchema,
        onSubmit,
    });



    return (
        <Modal
            show={mostraPasswordModale}
            onHide={() => setMostraPasswordModale(false)}
            dialogClassName="custom-modal-dialog"
            backdrop="static"
            style={{ minWidth: 'fit-content' }}
        >
                
            <Modal.Header closeButton>
                <Modal.Title>Modifica email</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Card.Subtitle className="mb-2 text-muted">Inserisci la nuova email, quindi inserisci la password attuale per completare la modifica</Card.Subtitle>

                <form
                    className='auth-form'
                    onSubmit={handleSubmit}
                    autoComplete='off'
                >
                    <div className='field-div'>
                        <div className='input-div'>
                            <label className="auth-label" htmlFor="nuovaPassword">Nuova password</label>
                            <input
                                className='auth-input'
                                value={values.nuovaPassword}
                                type='nuovaPassword'
                                id="nuovaPassword" 
                                placeholder="nuovaPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={addErrorStyle(errors.nuovaPassword, touched.nuovaPassword)}
                            />
                        </div>
                        {errors.nuovaPassword && touched.nuovaPassword && <p className="error">{errors.nuovaPassword}</p>}
                    </div>

                    <div className='field-div'>
                        <div className='input-div'>
                            <label className="auth-label" htmlFor="password">Password attuale</label>
                            <input
                                className='auth-input'
                                value={values.password}
                                type='password'
                                id="password" 
                                placeholder="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={addErrorStyle(errors.password, touched.password)}
                            />
                        </div>
                        {errors.password && touched.password && <p className="error">{errors.password}</p>}
                    </div>

                    <div className="modal-footer">
                                
                        <button className="login-button" type="submit">
                            Submit
                        </button>

                        <Button variant="secondary" onClick={() => setMostraPasswordModale(false)}>
                            ANNULLA
                        </Button>
                    
                    </div>

                </form>

            </Modal.Body>

        </Modal>

    );
}
