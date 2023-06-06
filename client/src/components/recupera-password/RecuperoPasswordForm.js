import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { resetPasswordSchema } from "./resetPasswordSchema";

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
    <div className="col-md-4">
      <div className="card-body">
        <div className="reset-password-form">
          {passwordResetSuccessful ? (
            <>
              <h2>Password reimpostata con successo</h2>
              <p>
                Ora puoi effettuare il <a href="/profilo">login</a> con la tua
                nuova password.
              </p>
            </>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <h2>Reimposta la tua password</h2>
              <div className="mb-3">
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
              <div className="mb-3">
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
              <button className="login-button" type="submit">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
