import React from "react";

const MedicalReportView = ({ analysis }) => {
  if (!analysis) return null;

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

  return (
    <div className="card shadow-sm p-4 bg-white border-0 rounded-3 text-dark">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
          <h4 className="text-primary fw-bold mb-0">LabFlow</h4>
          <small className="text-muted">Smart Laboratory Management</small>
        </div>
        <div className="text-end">
          <span className="badge bg-success">Rapport Officiel</span>
          <p className="text-muted small mb-0 mt-1">
            Date: {formatDate(analysis.createdAt)}
          </p>
        </div>
      </div>

      <h5 className="text-center text-uppercase fw-bold mb-4">
        Compte Rendu d'Analyse Médicale
      </h5>

      {/* Info Box */}
      <div className="row bg-light p-3 rounded-3 mb-4 g-2">
        <div className="col-6">
          <strong>N° Dossier:</strong> {analysis.NumeroDossier}
        </div>
        <div className="col-6">
          <strong>Type d'analyse:</strong> {analysis.TypeAnalyse}
        </div>
        <div className="col-6">
          <strong>Heure de prélèvement:</strong>{" "}
          {analysis.HeurePrelevement || "—"}
        </div>
        <div className="col-6">
          <strong>Statut:</strong>{" "}
          <span className="text-success fw-bold">{analysis.Statut}</span>
        </div>
      </div>

      {/* Table */}
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
            {analysis.Tests?.length > 0 ? (
              analysis.Tests.map((t, i) => (
                <tr key={i}>
                  <td className="fw-bold">{t.testName}</td>
                  <td>{t.ValeurResultat}</td>
                  <td className="text-muted">{t.ValeurUsuelle}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Aucun test disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-muted small mt-4 pt-3 border-top">
        LabFlow - Système de Gestion de Laboratoire Médical | Document généré
        électroniquement et sécurisé © 2026
      </div>
    </div>
  );
};

export default MedicalReportView;
