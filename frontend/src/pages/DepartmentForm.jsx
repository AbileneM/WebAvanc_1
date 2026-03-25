import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { departmentService } from "../services/entityService";

function DepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nom: "",
    histoire: "",
    domaine: "literature",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadDepartment = async () => {
      try {
        const data = await departmentService.getById(id);
        const item = data?.data || {};

        setForm({
          nom: item.nom || "",
          histoire: item.histoire || "",
          domaine: item.domaine || "literature",
        });
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nom.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await departmentService.update(id, {
          nom: form.nom,
          histoire: form.histoire,
          domaine: form.domaine,
        });
      } else {
        const payload = new FormData();
        payload.append("nom", form.nom);
        payload.append("histoire", form.histoire);
        payload.append("domaine", form.domaine);

        if (imageFile) {
          payload.append("image", imageFile);
        }

        await departmentService.create(payload);
      }

      navigate("/departments");
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      title={isEdit ? "Modifier un département" : "Ajouter un département"}
    >
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
                <label>Domaine</label>
                <select
                  name="domaine"
                  value={form.domaine}
                  onChange={handleChange}
                >
                  <option value="literature">literature</option>
                  <option value="science">science</option>
                  <option value="informatique">informatique</option>
                  <option value="gestion">gestion</option>
                  <option value="philo">philo</option>
                </select>
              </div>

              <div className="full-width">
                <label>Histoire</label>
                <textarea
                  name="histoire"
                  rows="5"
                  value={form.histoire}
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
              <Link to="/departments" className="ghost-btn">
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

export default DepartmentForm;