import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import CookieManager from'../../tokenManager/cookieManager';


export default function EmailUpdateConfirmation() {
  const { token } = useParams();
  const [confirmationStatus, setConfirmationStatus] = useState("pending");
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmEmailUpdate = async () => {
      try {
        const response = await fetch("/api/v1/profiloData/verifica-email", {
          method: "PUT",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${CookieManager.getAuthToken()}`
        },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setConfirmationStatus("success");
        } else {
          const errorData = await response.json();
          setError(errorData.message);
          setConfirmationStatus("error");
        }
      } catch (error) {
        console.error("Errore:", error);
        setError("Si è verificato un errore durante la conferma dell'aggiornamento dell'email.");
        setConfirmationStatus("error");
      }
    };

    confirmEmailUpdate();
  }, [token]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          
            <div className="card-body">
              <h1>Form di conferma aggiornamento email</h1>

              <div className="my-special-custom col-md-6">
                <form className="my-special-custom-form">
                  {confirmationStatus === "pending" && (
                    <p className="text-center">Conferma in corso...</p>
                  )}

                  {confirmationStatus === "success" && (
                    <>
                      <h2 className="text-center">Email Aggiornata!</h2>
                      <br></br>
                      <p>
                        La tua email è stata aggiornata correttamente.
                      </p>
                      <p className="text-center">
                        Torna al tuo <Link to="/profilo">profilo</Link>.
                      </p>
                    </>
                  )}

                  {confirmationStatus === "error" && (
                    <>
                      <h2 className="text-center">Errore durante la conferma</h2>
                      <br></br>
                      <p>{error}</p>
                      <p className="text-center">
                        Si prega di riprovare più tardi o contattare il supporto.
                      </p>
                    </>
                  )}
                </form>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
}