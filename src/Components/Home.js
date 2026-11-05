import React from "react";
import { Link } from "react-router-dom";
import { Users, ShieldCheck, Bell, FileText, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="home-container">
      {/* 1. قسم الواجهة الرئيسية (Hero Section) */}
      <div className="hero-section mb-5" style={{ marginTop: "50px" }}>
        <div className="row align-items-center">
          <div className="col-lg-6 text-lg-start text-center mb-4 mb-lg-0">
            <span className="badge bg-light text-primary mb-3 px-3 py-2 fw-bold rounded-pill">
              Solution intelligente
            </span>
            <h1 className="display-4 fw-bold mb-3">
              Votre laboratoire, plus intelligent et plus rapide.
            </h1>
            <p className="lead mb-4 text-white-50">
              Une gestion simplifiée de votre laboratoire grâce à des outils
              numériques avancés, des résultats sécurisés et une communication
              fluide.
            </p>
            <div className="d-flex justify-content-center justify-content-lg-start gap-3">
              <Link
                to="/login"
                className="btn btn-light text-primary fw-bold px-4 py-2 shadow-sm"
              >
                Commencer <ArrowRight size={18} className="ms-2" />
              </Link>
              <a
                href="#features"
                className="btn btn-outline-light fw-bold px-4 py-2"
              >
                En savoir plus
              </a>
            </div>
          </div>

          <div className="col-lg-6 text-center">
            {/* رسومات توضيحية طبية عصرية مطابقة للتصميم */}
            <div className="hero-illustration p-4 bg-white rounded-4 shadow-lg text-dark d-inline-block">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <div className="test-tubes-group d-flex align-items-end gap-2">
                  <div
                    className="tube bg-primary rounded-pill"
                    style={{ width: "18px", height: "100px", opacity: 0.8 }}
                  ></div>
                  <div
                    className="tube bg-primary rounded-pill"
                    style={{ width: "18px", height: "120px" }}
                  ></div>
                </div>
                <div className="flask-icon text-primary mx-3">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.31a7 7 0 1 1-4 0V9.31"></path>
                  </svg>
                </div>
                <div className="test-tubes-group d-flex align-items-end gap-2">
                  <div
                    className="tube bg-primary rounded-pill"
                    style={{ width: "18px", height: "90px" }}
                  ></div>
                  <div
                    className="tube bg-primary rounded-pill"
                    style={{ width: "18px", height: "110px", opacity: 0.8 }}
                  ></div>
                </div>
              </div>
              <div className="mt-3 fw-bold text-muted small">
                Science. Innovation. Better Care.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. قسم الميزات (Features Section) */}
      <div id="features" className="row g-4 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 p-4 border-0 shadow-sm text-center feature-card">
            <div className="feature-icon-wrapper mx-auto mb-3 text-primary bg-light p-3 rounded-circle d-inline-flex">
              <Users size={28} />
            </div>
            <h5 className="fw-bold mb-2">
              Gestion intelligente des utilisateurs
            </h5>
            <p className="text-muted small mb-0">
              Contrôle total des rôles et des accès du personnel et des
              patients.
            </p>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card h-100 p-4 border-0 shadow-sm text-center feature-card">
            <div className="feature-icon-wrapper mx-auto mb-3 text-primary bg-light p-3 rounded-circle d-inline-flex">
              <ShieldCheck size={28} />
            </div>
            <h5 className="fw-bold mb-2">
              Résultats sécurisés pour les patients
            </h5>
            <p className="text-muted small mb-0">
              Confidentialité absolue et protection des données médicales
              sensibles.
            </p>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card h-100 p-4 border-0 shadow-sm text-center feature-card">
            <div className="feature-icon-wrapper mx-auto mb-3 text-primary bg-light p-3 rounded-circle d-inline-flex">
              <Bell size={28} />
            </div>
            <h5 className="fw-bold mb-2">Notifications en temps réel</h5>
            <p className="text-muted small mb-0">
              Alertes instantanées pour le suivi des dossiers et des analyses.
            </p>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card h-100 p-4 border-0 shadow-sm text-center feature-card">
            <div className="feature-icon-wrapper mx-auto mb-3 text-primary bg-light p-3 rounded-circle d-inline-flex">
              <FileText size={28} />
            </div>
            <h5 className="fw-bold mb-2">Rapports médicaux téléchargeables</h5>
            <p className="text-muted small mb-0">
              Génération automatique et instantanée des bilans au format PDF.
            </p>
          </div>
        </div>
      </div>

      {/* 3. قسم "كيف يشتغل النظام؟" (Comment ça marche ?) */}
      <div className="card border-0 shadow-sm p-5 mb-5 rounded-4 text-center">
        <h2 className="fw-bold mb-2">Comment ça marche ?</h2>
        <p className="text-muted mb-5">Un processus simple en 4 étapes</p>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="step-item p-3">
              <div
                className="step-number bg-primary text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                1
              </div>
              <h6 className="fw-bold mb-2">Inscrivez-vous</h6>
              <p className="text-muted small mb-0">
                Le laboratoire crée votre espace personnel.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-item p-3">
              <div
                className="step-number bg-primary text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                2
              </div>
              <h6 className="fw-bold mb-2">Effectuez vos analyses</h6>
              <p className="text-muted small mb-0">
                Vos échantillons sont traités avec soin.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-item p-3">
              <div
                className="step-number bg-primary text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                3
              </div>
              <h6 className="fw-bold mb-2">Consultez vos résultats</h6>
              <p className="text-muted small mb-0">
                Suivez l'état de chaque analyse en direct.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="step-item p-3">
              <div
                className="step-number bg-primary text-white fw-bold rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                4
              </div>
              <h6 className="fw-bold mb-2">Téléchargez vos rapports</h6>
              <p className="text-muted small mb-0">
                Récupérez vos résultats en PDF.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. تذييل الصفحة (Footer Banner) */}
      <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 bg-primary text-white d-flex flex-row justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1">LabFlow</h4>
          <p className="mb-0 text-white-50 small">
            La technologie au service de votre santé
          </p>
        </div>
        <div>
          <Link to="/login" className="btn btn-light text-primary fw-bold px-4">
            Se connecter
          </Link>
        </div>
      </div>

      <div className="text-center text-muted small pb-4">
        © 2026 LabFlow. Tous droits réservés.
      </div>
    </div>
  );
};

export default Home;
