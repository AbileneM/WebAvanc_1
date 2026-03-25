import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { departmentService, getImageUrl } from "../services/entityService";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data?.data?.departments || []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des départements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter((item) =>
      `${item.nom || ""} ${item.histoire || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce département ?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await departmentService.remove(id);
      setMessage("Département supprimé avec succès.");
      loadDepartments();
    } catch (err) {
      setError(err.message || "Suppression impossible.");
    }
  };

  return (
    <AppLayout title="Départements">
      <section className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher un département..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/departments/add" className="primary-btn">
          Ajouter un département
        </Link>
      </section>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <section className="state-box">Chargement des départements...</section>
      ) : filteredDepartments.length === 0 ? (
        <section className="state-box">Aucun département trouvé.</section>
      ) : (
        <section className="card-grid">
          {filteredDepartments.map((department) => {
            const imageUrl = getImageUrl(department.image);

            return (
              <article className="entity-card" key={department.id}>
                <div className="card-image-wrap">
                  {imageUrl ? (
                    <img
                      className="card-image"
                      src={imageUrl}
                      alt={department.nom}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="image-fallback">Aucune image</div>
                  )}
                </div>

                <div className="card-body">
                  <h3>{department.nom || "Sans nom"}</h3>
                  <p className="card-description">
                    {department.histoire || "Aucune histoire"}
                  </p>
                </div>

                <div className="card-actions">
                  <Link to={`/departments/${department.id}`} className="ghost-btn">
                    Voir
                  </Link>
                  <Link
                    to={`/departments/edit/${department.id}`}
                    className="ghost-btn"
                  >
                    Modifier
                  </Link>
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(department.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AppLayout>
  );
}

export default Departments;