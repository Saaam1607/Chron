import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function AccountConfirmation() {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyRegistration = async () => {
      try {
        const response = await fetch("/api/v1/profilo/verifica-registrazione", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setVerificationStatus("success");
        } else {
          const errorData = await response.json();
          setError(errorData.message);
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Errore:", error);
        setError("Si è verificato un errore durante la verifica dell'account.");
        setVerificationStatus("error");
      }
    };

    verifyRegistration();
  }, [token]);

  return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="card-body">
                      <h1>Form di conferma account</h1>

                        <div className="my-special-custom col-md-6">
                            <form className="my-special-custom-form">
                                {verificationStatus === "pending" && (
                                <p className="text-center">Verifica in corso...</p>
                                )}

                                {verificationStatus === "success" && (
                                <>
                                    <h2 className="text-center">Account Verificato!</h2>
                                    <br></br>
                                    <p>
                                    Ora puoi effettuare il{" "}
                                    <Link to="/profilo">login</Link> con le tue credenziali.
                                    </p>
                                    <p className="text-center">
                                    Se hai bisogno di assistenza, contatta il supporto.
                                    </p>
                                </>
                                )}

                                {verificationStatus === "error" && (
                                <>
                                    <h2 className="text-center">Errore durante la verifica</h2>
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