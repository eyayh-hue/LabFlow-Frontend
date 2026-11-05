import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Actions/UsersActions";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = useSelector((state) => state.UsersReducer.errors);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }, navigate));
  };

  return (
    <div className="container login-page">
      <div className="card login-card shadow">
        <div className="row g-0 login-row">
          {/* LEFT SIDE */}
          <div className="col-lg-6 login-left">
            <div className="login-brand">
              <FlaskConical size={30} strokeWidth={2.2} />
              <span>LabFlow</span>
            </div>

            <div className="login-lab-illustration">
              <div className="login-tube tube-1">
                <span></span>
              </div>

              <div className="login-tube tube-2">
                <span></span>
              </div>

              <div className="login-main-flask">
                <FlaskConical size={230} strokeWidth={1.5} />
                <div className="login-flask-liquid"></div>
              </div>

              <div className="login-tube tube-3">
                <span></span>
              </div>

              <div className="login-tube tube-4">
                <span></span>
              </div>
            </div>

            <div className="login-left-footer">
              <h3>Science. Innovation. Better Care.</h3>
              <p>Une gestion intelligente pour un diagnostic plus fiable.</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6 login-right">
            <div className="login-form-wrapper">
              <div className="login-heading">
                <h1>Bon retour !</h1>
                <p>Connectez-vous pour accéder à votre compte.</p>
              </div>

              {errors && (
                <div className="alert alert-danger" role="alert">
                  {errors.errors
                    ? errors.errors[0].msg
                    : "Identifiants incorrects"}
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* EMAIL */}
                <div className="login-input-group">
                  <Mail size={19} />

                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* PASSWORD */}
                <div className="login-input-group">
                  <Lock size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* OPTIONS */}
                <div className="login-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Se souvenir de moi</span>
                  </label>

                  <a href="/forgot-password">Mot de passe oublié ?</a>
                </div>

                {/* LOGIN BUTTON */}
                <button type="submit" className="login-submit">
                  Se connecter
                </button>
              </form>

              {/* DIVIDER */}
              <div className="login-divider">
                <span></span>
                <p>ou</p>
                <span></span>
              </div>

              {/* SECURITY */}
              <div className="login-security">
                <ShieldCheck size={19} />
                <span>Accès sécurisé à LabFlow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
