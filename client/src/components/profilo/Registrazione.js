import { useFormik } from 'formik';
import { basicSchema  } from './schemas';
import { handleAlert } from "../alert/Alert";


export default function Registrazione({setIsAuthenticated}){

    const onSubmit = (values, actions) => {
        actions.resetForm();
        fetch('api/v1/profilo/nuova-autenticazione', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: values.username, email: values.email, password: values.password})
        })
            .then(response => {
                if (response.ok) {
                    return
                } else if (response.status === 409) {
                    throw new Error("Email già esistente");
                } else if (response.status === 500){
                    throw new Error("Errore durante la registrazione");
                }
            })
                .then(data => {
                    handleAlert("Controlla L'email per attivare l'account", false, "warning");
                })
                .catch(error => {
                    alert(error.message);
                })
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: basicSchema,
        onSubmit,
    });

    function addErrorStyle(error, touched) {
        return {
          border: (error && touched) ? '2px solid red' : '',
        }
    }

    return (
      <div className="login-div">
            <form
                className='auth-form'
                onSubmit={handleSubmit}
                autoComplete='off'
            >
            <div className='field-div'>
                    <div className='input-div'>
                        <label className="auth-label" htmlFor="username">Username</label>
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
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input
                            className='auth-input'
                            value={values.email}
                            type='email'
                            id="email" 
                            placeholder="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={addErrorStyle(errors.email, touched.email)}
                        />
                    </div>
                    {errors.email && touched.email && <p className="error">{errors.email}</p>}
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
                <button
                    className="login-button"
                    type="submit">
                        Submit
                </button>
            </form>
      </div>
    );
}