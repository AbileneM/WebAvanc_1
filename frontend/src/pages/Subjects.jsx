import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl, subjectService } from "../services/entityService";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await subjectService.getAll();
      setSubjects(data?.data?.subjects || []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des matières");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) =>
      `${item.nom || ""} ${item.code || ""} ${item.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [subjects, search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette matière ?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await subjectService.remove(id);
      setMessage("Matière supprimée avec succès.");
      loadSubjects();
    } catch (err) {
      setError(
        err.message ||
          "Suppression impossible. Cette action peut nécessiter un compte admin."
      );
    }
  };

  return (
    <AppLayout title="Matières">
      <section className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher une matière..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/subjects/add" className="primary-btn">
          Ajouter une matière
        </Link>
      </section>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <section className="state-box">Chargement des matières...</section>
      ) : filteredSubjects.length === 0 ? (
        <section className="state-box">Aucune matière trouvée.</section>
      ) : (
        <section className="card-grid">
          {filteredSubjects.map((subject) => {
            const imageUrl = getImageUrl(subject.image);

            return (
              <article className="entity-card" key={subject.id}>
                <div className="card-image-wrap">
                  {imageUrl ? (
                    <img
                      className="card-image"
                      src={imageUrl}
                      alt={subject.nom}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="image-fallback">Aucune image</div>
                  )}
                </div>

                <div className="card-body">
                  <h3>{subject.nom || "Sans nom"}</h3>
                  <p className="entity-badge">{subject.code || "Sans code"}</p>
                  <p className="card-description">
                    {subject.description || "Aucune description"}
                  </p>
                  <p className="muted-text">
                    Statut : {subject.statut || "—"}
                  </p>
                </div>

                <div className="card-actions">
                  <Link to={`/subjects/${subject.id}`} className="ghost-btn">
                    Voir
                  </Link>
                  <Link
                    to={`/subjects/edit/${subject.id}`}
                    className="ghost-btn"
                  >
                    Modifier
                  </Link>
                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(subject.id)}
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

export default Subjects;