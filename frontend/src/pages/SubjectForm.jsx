import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { subjectService } from "../services/entityService";

function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nom: "",
    code: "",
    description: "",
    statut: "requis",
    DepartmentId: "",
    LaboratoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadSubject = async () => {
      try {
        const data = await subjectService.getById(id);
        const item = data?.data || {};

        setForm({
          nom: item.nom || "",
          code: item.code || "",
          description: item.description || "",
          statut: item.statut || "requis",
          DepartmentId: item.DepartmentId ? String(item.DepartmentId) : "",
          LaboratoryId: item.LaboratoryId ? String(item.LaboratoryId) : "",
        });
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nom.trim() || !form.code.trim()) {
      setError("Le nom et le code sont obligatoires.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        const payload = {
          nom: form.nom,
          code: form.code,
          description: form.description,
          statut: form.statut,
        };

        if (form.DepartmentId.trim()) {
          payload.DepartmentId = Number(form.DepartmentId);
        }

        if (form.LaboratoryId.trim()) {
          payload.LaboratoryId = Number(form.LaboratoryId);
        }

        await subjectService.update(id, payload);
      } else {
        const payload = new FormData();
        payload.append("nom", form.nom);
        payload.append("code", form.code);
        payload.append("description", form.description);
        payload.append("statut", form.statut);

        if (form.DepartmentId.trim()) {
          payload.append("DepartmentId", form.DepartmentId);
        }

        if (form.LaboratoryId.trim()) {
          payload.append("LaboratoryId", form.LaboratoryId);
        }

        if (imageFile) {
          payload.append("image", imageFile);
        }

        await subjectService.create(payload);
      }

      navigate("/subjects");
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title={isEdit ? "Modifier une matière" : "Ajouter une matière"}>
      {loading ? (
        <section className="state-box">Chargement...</section>
      ) : (
        <section className="form-card">
          <form className="entity-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Code</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                />
              </div>

              <div className="full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Statut</label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                >
                  <option value="requis">requis</option>
                  <option value="optionnel">optionnel</option>
                </select>
              </div>

              <div>
                <label>Department ID</label>
                <input
                  type="number"
                  name="DepartmentId"
                  value={form.DepartmentId}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Laboratory ID</label>
                <input
                  type="number"
                  name="LaboratoryId"
                  value={form.LaboratoryId}
                  onChange={handleChange}
                />
              </div>

              {!isEdit && (
                <div className="full-width">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              )}
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="form-actions">
              <Link to="/subjects" className="ghost-btn">
                Retour
              </Link>
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </section>
      )}
    </AppLayout>
  );
}

export default SubjectForm;