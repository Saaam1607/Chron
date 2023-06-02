import { useFormik } from 'formik';
import { Card, Button, Modal, Table, Form } from 'react-bootstrap';

import { basicSchema  } from '../schemas';
import CookieManager from'../../tokenManager/cookieManager';
import { handleAlert } from '../../alert/Alert';



function addErrorStyle(error, touched) {
    return {
        border: (error && touched) ? '2px solid red' : '',
    }
}



export default function UsernameModal({mostraUsernameModal, setMostraUsernameModal}){

    function modificaUsername(username){
        fetch('api/v1/profiloData/username', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`
            },
            body: JSON.stringify({username: username, password: values.password})
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
                    handleAlert("Username aggiornato", false, "success");
                })
                    .catch(error => {

                        let message = "Modifica non riuscita";
                        if (error.status === 401){
                            message ="Password inserita non corretta";
                        }

                        handleAlert(message, false, "error");
                    })
    }

    const onSubmit = async (values, actions) => {
        actions.resetForm();
        await modificaUsername(values.username);
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: basicSchema,
        onSubmit,
    });



    return (
        <Modal
            show={mostraUsernameModal}
            onHide={() => setMostraUsernameModal(false)}
            dialogClassName="custom-modal-dialog"
            backdrop="static"
            style={{ minWidth: 'fit-content' }}
        >
                
            <Modal.Header closeButton>
                <Modal.Title>Modifica username</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Card.Subtitle className="mb-2 text-muted">Inserisci il nuovo username, quindi inserisci la password attuale per completare la modifica</Card.Subtitle>

                <form
                    className='auth-form'
                    onSubmit={handleSubmit}
                    autoComplete='off'
                >
                    <div className='field-div'>
                        <div className='input-div'>
                            <label className="auth-label" htmlFor="username">Nuovo username</label>
                            <input
                                className='auth-input'
                                value={values.username}
                                type='username'
                                id="username" 
                                placeholder="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={addErrorStyle(errors.username, touched.username)}
                            />
                        </div>
                        {errors.username && touched.username && <p className="error">{errors.username}</p>}
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

                        <Button variant="secondary" onClick={() => setMostraUsernameModal(false)}>
                            ANNULLA
                        </Button>
                    
                    </div>

                </form>

            </Modal.Body>

        </Modal>

    );
}
