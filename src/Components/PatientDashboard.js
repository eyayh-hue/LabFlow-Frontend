import React, { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Heart,
  MapPin,
  FileText,
  Download,
  Eye,
  Search,
  Clock,
} from "lucide-react";
import MedicalReportView from "./MedicalReportView";
import MedicalReportPDF from "./MedicalReportPDF";
const apiURL = process.env.REACT_APP_API_URL;

const PatientDashboard = () => {
  const [patientAnalyses, setPatientAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);
  const [error, setError] = useState("");

  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientStatusFilter, setPatientStatusFilter] = useState("Tous");

  const fetchPatientAnalyses = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/analyses/getPatientAnalyses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const analyses = res.data.analyses || [];
      setPatientAnalyses(analyses);

      if (analyses.length > 0) {
        setSelectedAnalyse(analyses[0]);
      }
    } catch (err) {
      console.error("Erreur récupération analyses :", err);
      setError(
        err.response?.data?.message || "Impossible de récupérer vos analyses.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientAnalyses();
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

  const filteredPatientAnalyses = patientAnalyses.filter((item) => {
    const matchesSearch =
      item.NumeroDossier?.toLowerCase().includes(
        patientSearchTerm.toLowerCase(),
      ) ||
      item.TypeAnalyse?.toLowerCase().includes(patientSearchTerm.toLowerCase());

    const matchesStatus =
      patientStatusFilter === "Tous" || item.Statut === patientStatusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center my-5 fw-bold text-primary">
        Chargement de vos analyses...
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-primary mb-4 d-flex align-items-center gap-2">
        <Heart size={28} /> Espace patient – Mes analyses
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold d-flex align-items-center gap-2 ${
              activeTab === "recent"
                ? "active bg-primary text-white"
                : "bg-light text-dark"
            }`}
            onClick={() => setActiveTab("recent")}
          >
            <MapPin size={16} /> Analyse récente
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link fw-bold d-flex align-items-center gap-2 ${
              activeTab === "historique"
                ? "active bg-primary text-white"
                : "bg-light text-dark"
            }`}
            onClick={() => setActiveTab("historique")}
          >
            <FileText size={16} /> Historique
          </button>
        </li>
      </ul>

      {activeTab === "recent" ? (
        <div className="card shadow-sm border-0 mb-5 rounded-3">
          <div className="card-header bg-primary text-white fw-bold fs-5 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="d-inline-flex align-items-center gap-2">
              <MapPin size={20} /> Analyse récente (en suivi)
            </span>

            {selectedAnalyse?.Statut === "Prêt" && (
              <PDFDownloadLink
                document={<MedicalReportPDF analysis={selectedAnalyse} />}
                fileName={`Analyse_${selectedAnalyse.NumeroDossier || "Patient"}.pdf`}
                className="btn btn-light text-primary btn-sm fw-bold shadow-sm d-inline-flex align-items-center gap-2 text-decoration-none"
              >
                {({ loading }) => (
                  <>
                    <Download size={16} />
                    {loading ? "Préparation..." : "Télécharger le PDF"}
                  </>
                )}
              </PDFDownloadLink>
            )}
          </div>

          <div className="card-body p-4">
            {selectedAnalyse ? (
              <div className="p-3 bg-white">
                <div className="text-center mb-4">
                  <h3 className="text-primary fw-bold">
                    LabFlow - Laboratoire d'Analyses Médicales
                  </h3>
                  <hr />
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <strong>N° de dossier :</strong>
                    <p>{selectedAnalyse.NumeroDossier}</p>
                  </div>

                  <div className="col-md-3">
                    <strong>Type :</strong>
                    <p>{selectedAnalyse.TypeAnalyse}</p>
                  </div>

                  <div className="col-md-3">
                    <strong>Heure de prélèvement :</strong>
                    <p>{selectedAnalyse.HeurePrelevement || "—"}</p>
                  </div>

                  <div className="col-md-3">
                    <strong>Statut :</strong>
                    <p>
                      <span
                        className={`badge fs-6 ${
                          selectedAnalyse.Statut === "Prêt"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {selectedAnalyse.Statut}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-muted small mb-3">
                  Biologiste :{" "}
                  {selectedAnalyse.biologiste?.name || "Laboratoire"}
                  {" | Date : "}
                  {formatDate(selectedAnalyse.createdAt)}
                </div>

                {selectedAnalyse.Statut === "Prêt" ? (
                  <div>
                    <h6 className="fw-bold mt-4 text-secondary">
                      Détails des résultats :
                    </h6>

                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Test</th>
                            <th>Résultat</th>
                            <th>Valeurs de référence</th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedAnalyse.Tests?.length > 0 ? (
                            selectedAnalyse.Tests.map((t, idx) => (
                              <tr key={idx}>
                                <td>{t.testName}</td>
                                <td className="fw-bold text-dark">
                                  {t.ValeurResultat}
                                </td>
                                <td className="text-muted">
                                  {t.ValeurUsuelle}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">
                                Aucun résultat disponible.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning mt-4 d-flex align-items-center justify-content-center gap-2">
                    <Clock size={18} />
                    <span>
                      Vos résultats sont encore en cours de traitement. Ils
                      s'afficheront ici dès qu'ils seront prêts.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted mb-0">Aucune analyse trouvée.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-header bg-secondary text-white fw-bold fs-5 d-flex align-items-center gap-2">
            <FileText size={20} /> Historique des analyses
          </div>

          <div className="card-body p-4">
            <div className="row mb-4 g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par n° de dossier ou type d'analyse"
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={patientStatusFilter}
                  onChange={(e) => setPatientStatusFilter(e.target.value)}
                >
                  <option value="Tous">Tous les statuts</option>
                  <option value="En cours de traitement">
                    En cours de traitement
                  </option>
                  <option value="Prêt">Prêt</option>
                </select>
              </div>
            </div>

            {filteredPatientAnalyses.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>N° de dossier</th>
                      <th>Type d'analyse</th>
                      <th>Date</th>
                      <th>Heure de prélèvement</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatientAnalyses.map((item) => (
                      <tr key={item._id}>
                        <td>{item.NumeroDossier}</td>
                        <td>{item.TypeAnalyse}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>{item.HeurePrelevement || "—"}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.Statut === "Prêt"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {item.Statut}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            {/* زر فتح المودال للمعاينة */}
                            <button
                              className="btn btn-info btn-sm fw-bold d-inline-flex align-items-center gap-1 text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#previewPdfModal"
                              onClick={() => setSelectedAnalyse(item)}
                            >
                              <Eye size={15} /> Aperçu
                            </button>

                            {item.Statut === "Prêt" && (
                              <PDFDownloadLink
                                document={<MedicalReportPDF analysis={item} />}
                                fileName={`Analyse_${item.NumeroDossier || "Patient"}.pdf`}
                                className="btn btn-success btn-sm fw-bold d-inline-flex align-items-center gap-1 text-decoration-none text-white"
                              >
                                {({ loading }) => (
                                  <>
                                    <Download size={15} />
                                    {loading ? "..." : "Télécharger"}
                                  </>
                                )}
                              </PDFDownloadLink>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted mb-0">
                Aucun historique d'analyse trouvé.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal معاينة التقرير الطبي باستخدام MedicalReportView */}
      {selectedAnalyse && (
        <div
          className="modal fade"
          id="previewPdfModal"
          tabIndex="-1"
          aria-labelledby="previewPdfModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold" id="previewPdfModalLabel">
                  📄 Aperçu du Rapport - LabFlow
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4 bg-light">
                {/* استدعاء المكون المنفصل للمعاينة بالـ HTML العادي */}
                <MedicalReportView analysis={selectedAnalyse} />
              </div>

              <div className="modal-footer bg-white border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Fermer
                </button>

                {selectedAnalyse.Statut === "Prêt" && (
                  <PDFDownloadLink
                    document={<MedicalReportPDF analysis={selectedAnalyse} />}
                    fileName={`Analyse_${selectedAnalyse.NumeroDossier || "Patient"}.pdf`}
                    className="btn btn-success fw-bold d-inline-flex align-items-center gap-2 text-decoration-none text-white"
                  >
                    {({ loading }) => (
                      <>
                        <Download size={16} />
                        {loading ? "Préparation..." : "Télécharger le PDF"}
                      </>
                    )}
                  </PDFDownloadLink>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
