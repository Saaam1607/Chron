import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPasswordForm() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/1/profilo//reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setSuccessMessage('Password aggiornata con successo!');
        setErrorMessage('');
      } else {
        const data = await response.json();
        setSuccessMessage('');
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Errore durante il reset della password:', error);
      setSuccessMessage('');
      setErrorMessage('Errore durante il reset della password');
    }
  };

  return (
    <div>
      <h2>Reimposta la tua password</h2>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="newPassword">Nuova password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Aggiorna password</button>
      </form>
    </div>
  );
}