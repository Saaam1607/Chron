import { useFormik } from 'formik';
import { basicSchema  } from './schemas';

export default function Login(){

    const onSubmit = (values, actions) => {
        actions.resetForm();
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
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        value={values.email}
                        type='email'
                        id="email" 
                        placeholder="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.email && touched.email ? 'input-error' : ''}
                    />
                    {errors.email && touched.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
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