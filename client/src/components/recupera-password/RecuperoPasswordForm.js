import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { resetPasswordSchema } from "./resetPasswordSchema";
import './RecuperoPassword.css';


export default function ResetPasswordForm() {
  const { token } = useParams();
  const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/v1/profilo/richiesta-reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        if (response.ok) {
          console.log("Password reimpostata con successo");
          setPasswordResetSuccessful(true);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        console.error("Errore:", error);
        alert(error);
      }
    },
  });

  return (
    <div className="container">
      <div className="col-md-12">
        <div className="card-body">
          <h1>Reimposta la tua password</h1>

          <div className="my-special-custom col-md-6">
            {passwordResetSuccessful ? (
              <>
                <div  className="my-special-custom-form">
                  <h2>Password reimpostata con successo</h2>
                  <br />
                  <p>
                    Ora puoi effettuare il <a href="/profilo">login</a> con la tua
                    nuova password.
                  </p>
                </div>
              </>
            ) : (
              <form onSubmit={formik.handleSubmit} className="my-special-custom-form">
                <h2>Inseresci la nuova Password</h2>
                <div className="col-mb-3">
                  <label htmlFor="password" className="form-label">
                    Nuova password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.password && formik.touched.password
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <div className="col-mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Conferma password:
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.errors.confirmPassword &&
                    formik.touched.confirmPassword && (
                      <div className="invalid-feedback">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
                <br />
                <button className="login-button" type="submit">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>              
    </div>
  );
}
