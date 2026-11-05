import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUser,
  deleteAccount,
  updateProfile,
} from "../Redux/Actions/UsersActions";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.UsersReducer.user);
  const load = useSelector((state) => state.UsersReducer.load);

  const user = userState?.user || userState;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setSecondaryPhone(user.secondaryPhone || "");
    }
  }, [user]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    dispatch(
      updateProfile({
        name,
        email,
        phone,
        secondaryPhone,
        newPassword: newPassword ? newPassword : undefined,
      }),
    );

    setIsEditing(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      dispatch(deleteAccount(navigate));
    }
  };

  if (load) {
    return <h2 className="text-center mt-5">Chargement...</h2>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "550px" }}>
      <div className="card shadow p-4 bg-light">
        <h2 className="text-center mb-4 text-primary">Mon profil</h2>
        {user ? (
          <div>
            {!isEditing ? (
              <div>
                <hr />
                <p className="fs-5">
                  <strong>Nom :</strong> {user.name || "Non renseigné"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>E-mail :</strong> {user.email || "Non renseigné"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Téléphone :</strong> {user.phone || "Non renseigné"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Téléphone secondaire :</strong>{" "}
                  {user.secondaryPhone || "Non renseigné"}
                </p>
                <hr />
                <p className="fs-5">
                  <strong>Rôle :</strong>{" "}
                  <span className="badge bg-secondary">
                    {user.role || "Patient"}
                  </span>
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-warning w-100 mt-3 text-white fw-bold"
                >
                  Modifier mon profil
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger w-100 mt-2 fw-bold"
                >
                  Supprimer mon compte
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Téléphone (obligatoire)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Téléphone secondaire (facultatif)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                  />
                </div>
                <hr />
                <h5 className="text-secondary text-center">
                  Changer le mot de passe
                </h5>
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Laissez vide pour garder l'ancien"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le nouveau mot de passe"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-2 fw-bold"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary w-100 mt-2"
                >
                  Annuler
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="text-center text-danger">
            Aucune donnée utilisateur. Veuillez vous reconnecter.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
