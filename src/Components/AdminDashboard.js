import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUserByAdmin,
} from "../Redux/Actions/UsersActions";
import {
  ShieldCheck,
  Plus,
  Users,
  FlaskConical,
  Search,
  Mail,
  Phone,
  Smartphone,
  Pencil,
  Trash2,
  Eye,
  Ban,
} from "lucide-react";
const apiURL = process.env.REACT_APP_API_URL;

const ROLES = ["Patient", "Biologiste", "Admin", "SubAdmin"];

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.UsersReducer?.user);
  const allUsers = useSelector((state) => state.UsersReducer?.allUsers || []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    role: "Patient",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    role: "Patient",
  });

  const [analyses, setAnalyses] = useState([]);
  const [biologistes, setBiologistes] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  const [showAnalyseEditModal, setShowAnalyseEditModal] = useState(false);
  const [currentAnalyse, setCurrentAnalyse] = useState(null);
  const [selectedBio, setSelectedBio] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");

  const [showAnalyseViewModal, setShowAnalyseViewModal] = useState(false);

  // Recherche et filtre : utilisateurs
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("Tous");

  // Recherche et filtre : analyses
  const [analyseSearchTerm, setAnalyseSearchTerm] = useState("");
  const [analyseStatusFilter, setAnalyseStatusFilter] = useState("Tous");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        dispatch(getAllUsers());

        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const resAnalyses = await axios.get(
          `${apiURL}/api/analyses/admin/getAllAnalyses`,
          config,
        );
        setAnalyses(resAnalyses.data.analyses);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdminData();
  }, [dispatch]);

  useEffect(() => {
    const bios = allUsers?.filter((u) => u.role === "Biologiste") || [];
    setBiologistes(bios);
  }, [allUsers]);

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      dispatch(deleteUser(id));
    }
  };

  const handleDeleteAnalyse = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette analyse ?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiURL}/api/analyses/admin/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalyses(analyses.filter((a) => a._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAnalyseUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!currentAnalyse) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${apiURL}/api/analyses/admin/update/${currentAnalyse._id}`,
        {
          biologiste: selectedBio,
          Statut: selectedStatut,
          NumeroDossier: currentAnalyse.NumeroDossier,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAnalyses(
        analyses.map((a) =>
          a._id === currentAnalyse._id ? res.data.updatedAnalyse : a,
        ),
      );
      setShowAnalyseEditModal(false);
      alert(
        "Analyse mise à jour avec succès et notification envoyée au biologiste !",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditData({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      secondaryPhone: u.secondaryPhone || "",
      role: u.role || "Patient",
    });
    setShowEditModal(true);
  };

  const handleChange = (field) => (e) =>
    setEditData({ ...editData, [field]: e.target.value });

  const handleNewChange = (field) => (e) =>
    setNewUserData({ ...newUserData, [field]: e.target.value });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    await dispatch(updateUser(selectedUser._id, editData));
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      createUserByAdmin(newUserData, () => {
        setNewUserData({
          name: "",
          email: "",
          phone: "",
          secondaryPhone: "",
          role: "Patient",
        });
        setShowCreateModal(false);
      }),
    );
  };

  const canEditUser = (targetUser) => {
    if (!user) return false;
    if (targetUser.role === "Patient" || targetUser.role === "Biologiste")
      return true;
    if (user.role === "Admin" && user._id === targetUser._id) return true;
    if (user.role === "Admin" && targetUser.role === "SubAdmin") return true;
    if (user.role === "SubAdmin" && targetUser.role === "Admin") return true;
    if (user.role === "SubAdmin" && user._id === targetUser._id) return true;
    return false;
  };

  const canDeleteUser = (targetUser) => {
    if (!user) return false;
    if (targetUser.role === "Patient" || targetUser.role === "Biologiste")
      return true;
    if (user.role === "Admin") {
      if (user._id === targetUser._id) return false;
      if (targetUser.role === "SubAdmin") return true;
    }
    if (user.role === "SubAdmin") {
      if (targetUser.role === "Admin") return false;
      if (user._id === targetUser._id) return true;
    }
    return false;
  };

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesRole = userRoleFilter === "Tous" || u.role === userRoleFilter;

    return matchesSearch && matchesRole;
  });

  const filteredAnalysesAdmin = analyses.filter((a) => {
    const matchesSearch =
      a.NumeroDossier?.toLowerCase().includes(
        analyseSearchTerm.toLowerCase(),
      ) ||
      a.patient?.name
        ?.toLowerCase()
        .includes(analyseSearchTerm.toLowerCase()) ||
      a.biologiste?.name
        ?.toLowerCase()
        .includes(analyseSearchTerm.toLowerCase()) ||
      a.TypeAnalyse?.toLowerCase().includes(analyseSearchTerm.toLowerCase());

    const matchesStatus =
      analyseStatusFilter === "Tous" || a.Statut === analyseStatusFilter;

    return matchesSearch && matchesStatus;
  });

  if (user && user.role !== "Admin" && user.role !== "SubAdmin") {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h3 className="d-flex align-items-center justify-content-center gap-2">
            <Ban size={24} /> Accès non autorisé
          </h3>
          <p className="mb-0">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h2 className="fw-bold text-primary d-flex align-items-center gap-2 mb-0">
          <ShieldCheck size={28} /> Administration
        </h2>
        <button
          type="button"
          className="btn btn-success fw-bold shadow-sm d-inline-flex align-items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} /> Créer un utilisateur
        </button>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold d-flex align-items-center gap-2 ${activeTab === "users" ? "active bg-primary text-white" : "bg-light text-dark"}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={16} /> Utilisateurs ({allUsers.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold d-flex align-items-center gap-2 ${activeTab === "analyses" ? "active bg-primary text-white" : "bg-light text-dark"}`}
            onClick={() => setActiveTab("analyses")}
          >
            <FlaskConical size={16} /> Analyses ({analyses.length})
          </button>
        </li>
      </ul>

      {activeTab === "users" && (
        <div>
          <div className="row mb-4 g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par nom, e-mail ou téléphone"
                  aria-label="Rechercher un utilisateur"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                aria-label="Filtrer par rôle"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="Tous">Tous les rôles</option>
                <option value="Patient">Patient</option>
                <option value="Biologiste">Biologiste</option>
                <option value="SubAdmin">SubAdmin</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="alert alert-info text-center">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="row">
              {filteredUsers.map((u) => (
                <div className="col-md-4 col-sm-6 mb-4" key={u._id}>
                  <div className="card h-100 shadow-sm border-0 rounded-3">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title fw-bold text-dark mb-0">
                          {u.name || "Sans nom"}
                        </h5>
                        <span
                          className={`badge ${
                            u.role === "Admin"
                              ? "bg-danger"
                              : u.role === "SubAdmin"
                                ? "bg-warning text-dark"
                                : u.role === "Biologiste"
                                  ? "bg-success"
                                  : "bg-secondary"
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>

                      <hr />

                      <p className="card-text mb-1 text-muted d-flex align-items-center gap-2">
                        <Mail size={15} /> <span>{u.email}</span>
                      </p>
                      <p className="card-text mb-1 text-muted d-flex align-items-center gap-2">
                        <Phone size={15} />{" "}
                        <span>{u.phone || "Non disponible"}</span>
                      </p>
                      {u.secondaryPhone && (
                        <p className="card-text mb-1 text-muted d-flex align-items-center gap-2">
                          <Smartphone size={15} />{" "}
                          <span>{u.secondaryPhone}</span>
                        </p>
                      )}

                      <div className="mt-auto pt-3 d-flex justify-content-between gap-2">
                        {canEditUser(u) && (
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm w-100 fw-bold d-inline-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleEditClick(u)}
                          >
                            <Pencil size={14} /> Modifier
                          </button>
                        )}
                        {canDeleteUser(u) && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm w-100 fw-bold d-inline-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleDelete(u._id)}
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "analyses" && (
        <div className="card shadow-sm border-0 rounded-3 p-4">
          <h4 className="fw-bold text-primary mb-3">
            Liste de toutes les analyses
          </h4>

          <div className="row mb-4 g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par n° de dossier, patient, biologiste ou type"
                  aria-label="Rechercher une analyse"
                  value={analyseSearchTerm}
                  onChange={(e) => setAnalyseSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                aria-label="Filtrer par statut"
                value={analyseStatusFilter}
                onChange={(e) => setAnalyseStatusFilter(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En cours de traitement">
                  En cours de traitement
                </option>
                <option value="Prêt">Prêt</option>
              </select>
            </div>
          </div>

          {filteredAnalysesAdmin.length === 0 ? (
            <p className="text-muted">Aucune analyse trouvée.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>N° de dossier</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Biologiste assigné</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalysesAdmin.map((item) => (
                    <tr key={item._id}>
                      <td>{item.NumeroDossier}</td>
                      <td>{item.patient?.name || "Inconnu"}</td>
                      <td>{item.TypeAnalyse}</td>
                      <td>{item.biologiste?.name || "Non assigné"}</td>
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
                          <button
                            className="btn btn-info btn-sm fw-bold d-inline-flex align-items-center gap-1"
                            onClick={() => {
                              setCurrentAnalyse(item);
                              setShowAnalyseViewModal(true);
                            }}
                          >
                            <Eye size={14} /> Afficher
                          </button>

                          <button
                            className="btn btn-warning btn-sm fw-bold d-inline-flex align-items-center gap-1"
                            onClick={() => {
                              setCurrentAnalyse(item);
                              setSelectedBio(item.biologiste?._id || "");
                              setSelectedStatut(item.Statut);
                              setShowAnalyseEditModal(true);
                            }}
                          >
                            <Pencil size={14} /> Modifier
                          </button>

                          <button
                            className="btn btn-danger btn-sm fw-bold d-inline-flex align-items-center gap-1"
                            onClick={() => handleDeleteAnalyse(item._id)}
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showEditModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title fw-bold">
                    Modifier l'utilisateur
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Fermer"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.name}
                        onChange={handleChange("name")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editData.email}
                        onChange={handleChange("email")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.phone}
                        onChange={handleChange("phone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.secondaryPhone}
                        onChange={handleChange("secondaryPhone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Rôle</label>
                      <select
                        className="form-select"
                        value={editData.role}
                        onChange={handleChange("role")}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showCreateModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <div>
                    <h5 className="modal-title fw-bold">
                      Créer un utilisateur
                    </h5>
                    <small className="text-muted">
                      Le mot de passe est envoyé automatiquement par e-mail.
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Fermer"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Nom et prénom
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.name}
                        onChange={handleNewChange("name")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newUserData.email}
                        onChange={handleNewChange("email")}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.phone}
                        onChange={handleNewChange("phone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Téléphone secondaire
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newUserData.secondaryPhone}
                        onChange={handleNewChange("secondaryPhone")}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Rôle</label>
                      <select
                        className="form-select"
                        value={newUserData.role}
                        onChange={handleNewChange("role")}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-success fw-bold">
                      Créer et envoyer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showAnalyseEditModal && currentAnalyse && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title fw-bold">
                    Modifier l'analyse (dossier {currentAnalyse.NumeroDossier})
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Fermer"
                    onClick={() => setShowAnalyseEditModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleAnalyseUpdateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Biologiste assigné
                      </label>
                      <select
                        className="form-select"
                        value={selectedBio}
                        onChange={(e) => setSelectedBio(e.target.value)}
                      >
                        <option value="">Sélectionner un biologiste</option>
                        {biologistes.map((bio) => (
                          <option key={bio._id} value={bio._id}>
                            {bio.name} ({bio.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Statut</label>
                      <select
                        className="form-select"
                        value={selectedStatut}
                        onChange={(e) => setSelectedStatut(e.target.value)}
                      >
                        <option value="En cours de traitement">
                          En cours de traitement
                        </option>
                        <option value="Prêt">Prêt</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAnalyseEditModal(false)}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {showAnalyseViewModal && currentAnalyse && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title fw-bold">
                    Détails de l'analyse – dossier{" "}
                    {currentAnalyse.NumeroDossier}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Fermer"
                    onClick={() => setShowAnalyseViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Patient :</strong>{" "}
                        {currentAnalyse.patient?.name || "Inconnu"}
                      </p>
                      <p>
                        <strong>Type d'analyse :</strong>{" "}
                        {currentAnalyse.TypeAnalyse}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Biologiste :</strong>{" "}
                        {currentAnalyse.biologiste?.name || "Non assigné"}
                      </p>
                      <p>
                        <strong>Statut :</strong>{" "}
                        <span className="badge bg-secondary">
                          {currentAnalyse.Statut}
                        </span>
                      </p>
                    </div>
                  </div>

                  <h6 className="fw-bold text-secondary mt-4">
                    Résultats des tests :
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
                        {currentAnalyse.Tests?.map((t, idx) => (
                          <tr key={idx}>
                            <td>{t.testName}</td>
                            <td className="fw-bold">{t.ValeurResultat}</td>
                            <td className="text-muted">{t.ValeurUsuelle}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAnalyseViewModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
