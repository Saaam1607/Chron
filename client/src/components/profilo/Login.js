import { useFormik } from 'formik';
import { basicSchema  } from './schemas';
import CookieManager from'../tokenManager/cookieManager';

function addErrorStyle(error, touched) {
    return {
        border: (error && touched) ? '2px solid red' : '',
    }
}

export default function Login({setAuthenticated}){

    const onSubmit = (values, actions) => {
        actions.resetForm();
        fetch('api/v1/profilo/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: values.email, password: values.password})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    throw new Error("Email o password non corretti");
                } else if (response.status === 500){
                    throw new Error("Errore durante l'autenticazione");
                }
            })
                .then(data => {
                    setAuthenticated(true);
                    CookieManager.setAuthToken(data.token);
                })
                .catch(error => {
                    setAuthenticated(false);
                    alert(error.message);
                })
    };

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: basicSchema,
        onSubmit,
    });

    return (
      <div className="login-div">
            <form
                className='auth-form'
                onSubmit={handleSubmit}
                autoComplete='off'
            >
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