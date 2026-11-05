import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Redux/Actions/UsersActions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.forgotPassword || {});
  const { loading } = authState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const result = await dispatch(forgotPassword(email));
    if (result.success) {
      setMessage("Un e-mail de réinitialisation a été envoyé avec succès !");
    } else {
      setError(
        result.error ||
          "Une erreur s'est produite, veuillez vérifier votre adresse e-mail.",
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Mot de passe oublié ?</h2>
        <p>
          Entrez votre adresse e-mail et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Adresse e-mail</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>

        <div className="back-to-login">
          <a href="/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
