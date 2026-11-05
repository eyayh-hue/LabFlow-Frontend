import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../Redux/Actions/UsersActions";
import axios from "axios";
import {
  Microscope,
  Plus,
  Bell,
  Check,
  X,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
const apiURL = process.env.REACT_APP_API_URL;

const BiologisteDashboard = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.UsersReducer?.allUsers || []);
  const patients = allUsers.filter((u) => u.role === "Patient");

  const [analyses, setAnalyses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [NumeroDossier, setNumeroDossier] = useState("");
  const [TypeAnalyse, setTypeAnalyse] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [Statut, setStatut] = useState("En cours de traitement");
  const [HeurePrelevement, setHeurePrelevement] = useState("");
  const [tests, setTests] = useState([
    { testName: "", ValeurResultat: "", ValeurUsuelle: "" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const fetchBioAnalyses = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/analyses/getAllAnalyseBio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnalyses(res.data.analyses);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${apiURL}/api/analyses/biologiste/notifications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissNotification = async (id) => {
    try {
      await axios.delete(
        `${apiURL}/api/analyses/biologiste/notification/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(getAllUsers());
    fetchBioAnalyses();
    fetchNotifications();
  }, [dispatch]);

  const handleTestChange = (index, field, value) => {
    const newTests = [...tests];
    newTests[index][field] = value;
    setTests(newTests);
  };

  const addTestField = () => {
    setTests([
      ...tests,
      { testName: "", ValeurResultat: "", ValeurUsuelle: "" },
    ]);
  };

  const removeTestField = (index) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const analyseData = {
      patient: selectedPatient,
      NumeroDossier,
      TypeAnalyse,
      Statut,
      HeurePrelevement,
      Tests: tests,
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      if (isEdit) {
        await axios.put(
          `${apiURL}/api/analyses/update/${currentId}`,
          analyseData,
          config,
        );
        alert("Analyse modifiée avec succès");
      } else {
        await axios.post(`${apiURL}/api/analyses/add`, analyseData, config);
        alert("Analyse enregistrée avec succès");
      }

      setShowModal(false);
      resetForm();
      fetchBioAnalyses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (analyse) => {
    setIsEdit(true);
    setCurrentId(analyse._id);
    setSelectedPatient(analyse.patient?._id || "");
    setNumeroDossier(analyse.NumeroDossier);
    setTypeAnalyse(analyse.TypeAnalyse);
    setStatut(analyse.Statut || "En cours de traitement");
    setHeurePrelevement(analyse.HeurePrelevement || "");
    setTests(analyse.Tests);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette analyse ?")) {
      try {
        await axios.delete(`${apiURL}/api/analyses/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchBioAnalyses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setIsEdit(false);
    setCurrentId(null);
    setNumeroDossier("");
    setTypeAnalyse("");
    setSelectedPatient("");
    setStatut("En cours de traitement");
    setHeurePrelevement("");
    setTests([{ testName: "", ValeurResultat: "", ValeurUsuelle: "" }]);
  };

  const filteredAnalyses = analyses.filter((a) => {
    const matchesSearch =
      a.NumeroDossier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.TypeAnalyse?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === "Tous" || a.Statut === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h2 className="fw-bold text-success d-flex align-items-center gap-2 mb-0">
          <Microscope size={28} /> Espace biologiste
        </h2>
        <button
          className="btn btn-primary fw-bold d-inline-flex align-items-center gap-2"
          onClick={() => {
            resetForm();
            setShowModal(!showModal);
          }}
        >
          {showModal ? (
            "Fermer le formulaire"
          ) : (
            <>
              <Plus size={18} /> Ajouter une analyse
            </>
          )}
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="alert alert-info shadow-sm mb-4">
          <h5 className="fw-bold d-flex align-items-center gap-2">
            <Bell size={18} /> Notifications de l'administration
          </h5>
          <ul className="mb-0 ps-3">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className="text-dark small py-1 d-flex justify-content-between align-items-center"
              >
                <span>
                  {notif.message}{" "}
                  <span className="text-muted">
                    ({new Date(notif.createdAt).toLocaleString("fr-FR")})
                  </span>
                </span>
                <button
                  className="btn btn-sm btn-outline-primary fw-bold ms-3 d-inline-flex align-items-center gap-1"
                  onClick={() => handleDismissNotification(notif._id)}
                >
                  <Check size={14} /> Marquer comme lu
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && (
        <div className="card shadow border-0 p-4 rounded-3 mb-5">
          <h4 className="mb-3 text-primary">
            {isEdit ? "Modifier l'analyse" : "Ajouter un résultat d'analyse"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Sélectionner le patient
                </label>
                <select
                  className="form-select"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                >
                  <option value="">-- Choisir un patient --</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">N° de dossier</label>
                <input
                  type="text"
                  className="form-control"
                  value={NumeroDossier}
                  onChange={(e) => setNumeroDossier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Type d'analyse</label>
                <input
                  type="text"
                  className="form-control"
                  value={TypeAnalyse}
                  onChange={(e) => setTypeAnalyse(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  Heure de prélèvement
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={HeurePrelevement}
                  onChange={(e) => setHeurePrelevement(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  Statut de l'analyse
                </label>
                <select
                  className="form-select"
                  value={Statut}
                  onChange={(e) => setStatut(e.target.value)}
                >
                  <option value="En cours de traitement">
                    En cours de traitement
                  </option>
                  <option value="Prêt">Prêt</option>
                </select>
              </div>
            </div>

            <hr />
            <h5 className="fw-bold text-secondary">Détails des tests</h5>
            {tests.map((test, index) => (
              <div className="row mb-3 align-items-center" key={index}>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom du test"
                    aria-label="Nom du test"
                    value={test.testName}
                    onChange={(e) =>
                      handleTestChange(index, "testName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Résultat"
                    aria-label="Résultat"
                    value={test.ValeurResultat}
                    onChange={(e) =>
                      handleTestChange(index, "ValeurResultat", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Valeurs de référence"
                    aria-label="Valeurs de référence"
                    value={test.ValeurUsuelle}
                    onChange={(e) =>
                      handleTestChange(index, "ValeurUsuelle", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-1">
                  {tests.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                      onClick={() => removeTestField(index)}
                      aria-label="Retirer ce test"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary btn-sm mb-4 d-inline-flex align-items-center gap-1"
              onClick={addTestField}
            >
              <Plus size={16} /> Ajouter un autre test
            </button>

            <div>
              <button type="submit" className="btn btn-success fw-bold px-4">
                {isEdit ? "Modifier l'analyse" : "Enregistrer et publier"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card shadow border-0 p-4 rounded-3">
        <h4 className="mb-3 text-secondary">Liste de mes analyses</h4>

        <div className="row mb-4 g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par n° de dossier, patient ou type d'analyse"
                aria-label="Rechercher une analyse"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Filtrer par statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Tous">Tous les statuts</option>
              <option value="En cours de traitement">
                En cours de traitement
              </option>
              <option value="Prêt">Prêt</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>N° de dossier</th>
                <th>Patient</th>
                <th>Type d'analyse</th>
                <th>Heure de prélèvement</th>
                <th>Statut</th>
                <th>Date / Modifié le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((a) => (
                  <tr key={a._id}>
                    <td>{a.NumeroDossier}</td>
                    <td>{a.patient?.name || "Inconnu"}</td>
                    <td>{a.TypeAnalyse}</td>
                    <td>{a.HeurePrelevement || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.Statut === "Prêt"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {a.Statut}
                      </span>
                    </td>
                    <td>
                      {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                      {a.updatedAt && (
                        <span className="text-muted d-block small">
                          Modifié le :{" "}
                          {new Date(a.updatedAt).toLocaleString("fr-FR")}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-warning btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => handleEdit(a)}
                        >
                          <Pencil size={14} /> Modifier
                        </button>
                        <button
                          className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1"
                          onClick={() => handleDelete(a._id)}
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Aucune analyse trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BiologisteDashboard;
