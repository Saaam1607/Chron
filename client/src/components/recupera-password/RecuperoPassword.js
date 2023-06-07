import React, { useState } from "react";
import { handleAlert } from '../alert/Alert';
import { useFormik } from "formik";
import * as Yup from "yup";

function addErrorStyle(error, touched) {
  return {
    border: error && touched ? "2px solid red" : "",
  };
}

export default function RecuperaPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const basicSchema = Yup.object({
    email: Yup.string()
      .email("Email non valida")
      .required("Campo obbligatorio"),
  });

  const sendPasswordResetEmail = async (email) => {
    try {
      const response = await fetch("/api/v1/profilo/richiesta-nuova-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Email di recupero password inviata con successo
        setEmailSent(true);
        console.log("Email di recupero password inviata con successo");
        handleAlert("Controlla la tua casella di posta", false, "warning");

      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Errore:", error);
      alert(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: basicSchema,
    onSubmit: (values) => {
      sendPasswordResetEmail(values.email);
    },
  });

  return (
    <div className="login-div">
      {emailSent ? (
        <p>
          Email di recupero password inviata con successo. Controlla la tua
          casella di posta.
        </p>
      ) : (
        <>
          <form className="auth-form" onSubmit={formik.handleSubmit}>
            <div className="field-div">
              <div className="input-div">
                <label className="auth-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="auth-input"
                  id="email"
                  type="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  style={addErrorStyle(
                    formik.errors.email,
                    formik.touched.email
                  )}
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className="error">{formik.errors.email}</p>
              )}
            </div>
            <button className="login-button" type="submit">
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
}
