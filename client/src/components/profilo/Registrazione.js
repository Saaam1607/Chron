import { useFormik } from 'formik';
import { basicSchema  } from './schemas';

export default function Registrazione({setAuthenticated}){

    const onSubmit = (values, actions) => {
        actions.resetForm();
        fetch('api/v1/profilo/registrazione', {
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

    return (
      <div className="login-div">
            <form onSubmit={handleSubmit} autoComplete='off'>
            <div className='field-div'>
                    <div className='input-div'>
                        <label className='email-label' htmlFor="username">Username</label>
                        <input
                            value={values.username}
                            type='username'
                            id="username" 
                            placeholder="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.username && touched.username ? 'input-error' : ''}
                        />
                    </div>
                    {errors.username && touched.username && <p className="error">{errors.username}</p>}
                </div>
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