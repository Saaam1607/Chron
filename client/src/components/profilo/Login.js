import { useFormik } from 'formik';
import { basicSchema  } from './schemas';
const tokenManager = require('../tokenManager/cookieManager');

export default function Login({setAuthenticated}){

    const onSubmit = (values, actions) => {
        //actions.resetForm();
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
                    tokenManager.setAuthToken(data.token);
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
            <form onSubmit={handleSubmit} autoComplete='off'>
                <div className='field-div'>
                    <div className='input-div'>
                        <label className='email-label' htmlFor="email">Email</label>
                        <input
                            value={values.email}
                            type='email'
                            id="email" 
                            placeholder="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email && touched.email ? 'input-error' : ''}
                        />
                    </div>
                    {errors.email && touched.email && <p className="error">{errors.email}</p>}
                </div>
                <div className='field-div'>
                    <div className='input-div'>
                        <label htmlFor="password">Password</label>
                        <input
                            value={values.password}
                            type='password'
                            id="password" 
                            placeholder="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password ? 'input-error' : ''}
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