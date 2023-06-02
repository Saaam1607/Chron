import { Card, Button, Modal, Table, Form } from 'react-bootstrap';
import { handleAlert } from '../../alert/Alert';
//import CookieManager from '../tokenManager/cookieManager';
import { useFormik } from 'formik';
import { basicSchema  } from '../schemas';



function addErrorStyle(error, touched) {
    return {
        border: (error && touched) ? '2px solid red' : '',
    }
}



export default function UsernameModal ({mostraUsernameModal, setMostraUsernameModal}){

    const onSubmit = (values, actions) => {
        actions.resetForm();
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: basicSchema,
        onSubmit,
    });




    return (
        <div>
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
                                <label className="auth-label" htmlFor="password">Password</label>
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
                        
                    </form>

                </Modal.Body>

                <Modal.Footer>
                    <button
                        className="login-button"
                        type="submit"
                        onClick={() =>setMostraUsernameModal(false)}                        >
                            Submit
                    </button>
                    <Button variant="secondary" onClick={() =>setMostraUsernameModal(false)}>
                        ANNULLA
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
