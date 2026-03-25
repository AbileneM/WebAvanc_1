import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    naissance: "",
    conduite: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur chargement users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      mot_de_passe: "",
      naissance: "",
      conduite: "",
    });
    setEditId(null);
    setFieldErrors({});
    setError("");
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
    setMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.nom.trim()) {
      nextErrors.nom = "Le nom est obligatoire.";
    }

    if (!form.prenom.trim()) {
      nextErrors.prenom = "Le prénom est obligatoire.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "L'email est obligatoire.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Le format de l'email est invalide.";
    }

    if (!editId && !form.mot_de_passe.trim()) {
      nextErrors.mot_de_passe = "Le mot de passe est obligatoire.";
    }

    if (!form.naissance) {
      nextErrors.naissance = "La date de naissance est obligatoire.";
    }

    if (!form.conduite) {
      nextErrors.conduite = "La conduite est obligatoire.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError("Veuillez corriger les champs en rouge.");
      setSaving(false);
      return;
    }

    const payload = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      email: form.email.trim(),
      naissance: form.naissance || undefined,
      conduite: form.conduite || undefined,
    };

    if (!editId || form.mot_de_passe.trim()) {
      payload.mot_de_passe = form.mot_de_passe;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/users/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Utilisateur modifié avec succès.");
      } else {
        await axios.post("http://localhost:5000/api/users", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Utilisateur ajouté avec succès.");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        setError(apiErrors.map((item) => item.msg).join(" | "));
      } else {
        setError(err.response?.data?.message || "Erreur ajout/modif user");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    try {
      setError("");
      setMessage("");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur suppression");
    }
  };

  const handleEdit = (user) => {
    setForm({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
      mot_de_passe: "",
      naissance: user.naissance || "",
      conduite: user.conduite || "",
    });
    setEditId(user.id);
    setFieldErrors({});
    setError("");
    setMessage("");
  };

  return (
    <AppLayout title="Utilisateurs">
      <div className="container py-4">
        <div className="card shadow-sm p-4 mb-4">
          <h3 className="mb-3">
            {editId ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input className="form-control" name="nom" value={form.nom} onChange={handleChange} />
                {fieldErrors.nom && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.nom}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input className="form-control" name="prenom" value={form.prenom} onChange={handleChange} />
                {fieldErrors.prenom && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.prenom}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} />
                {fieldErrors.email && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.email}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Mot de passe {editId ? "(laisser vide pour conserver)" : ""}
                </label>
                <input className="form-control" name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleChange} />
                {fieldErrors.mot_de_passe && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.mot_de_passe}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Naissance</label>
                <input className="form-control" name="naissance" type="date" value={form.naissance} onChange={handleChange} />
                {fieldErrors.naissance && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.naissance}</p>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Conduite</label>
                <select className="form-select" name="conduite" value={form.conduite} onChange={handleChange}>
                  <option value="">Choisir conduite</option>
                  <option value="excellente">Excellente</option>
                  <option value="bonne">Bonne</option>
                  <option value="passable">Passable</option>
                </select>
                {fieldErrors.conduite && <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>{fieldErrors.conduite}</p>}
              </div>
            </div>

            {message && <p className="success-text mt-3 mb-0">{message}</p>}
            {error && <p className="error-text mt-3 mb-0">{error}</p>}

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? "Enregistrement..." : editId ? "Modifier" : "Ajouter"}
              </button>

              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Annuler
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="alert alert-info">Chargement des utilisateurs...</div>
        ) : users.length === 0 ? (
          <div className="alert alert-warning">Aucun utilisateur trouvé.</div>
        ) : (
          <div className="row g-3">
            {users.map((u) => (
              <div className="col-md-6" key={u.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h4 className="card-title mb-2">{u.nom} {u.prenom}</h4>
                    <p className="mb-2"><strong>Email :</strong> {u.email}</p>
                    <p className="mb-2"><strong>Naissance :</strong> {u.naissance || "—"}</p>
                    <p className="mb-3"><strong>Conduite :</strong> {u.conduite || "—"}</p>

                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(u)}>
                        Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Users;
