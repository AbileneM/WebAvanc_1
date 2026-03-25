import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getImageUrl, subjectService } from "../services/entityService";

function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const data = await subjectService.getById(id);
        setSubject(data?.data || null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [id]);

  const imageUrl = getImageUrl(subject?.image);

  return (
    <AppLayout title="Détail matière">
      {loading ? (
        <section className="state-box">Chargement...</section>
      ) : error ? (
        <section className="state-box error-text">{error}</section>
      ) : (
        <section className="details-card">
          <div className="details-image-wrap">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={subject?.nom}
                className="details-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="image-fallback large">Aucune image</div>
            )}
          </div>

          <div className="details-content">
            <h2>{subject?.nom || "Sans nom"}</h2>
            <p><strong>Code :</strong> {subject?.code || "—"}</p>
            <p><strong>Description :</strong> {subject?.description || "—"}</p>
            <p><strong>Statut :</strong> {subject?.statut || "—"}</p>
            <p><strong>Department ID :</strong> {subject?.DepartmentId ?? "—"}</p>
            <p><strong>Laboratory ID :</strong> {subject?.LaboratoryId ?? "—"}</p>

            <div className="form-actions">
              <Link to="/subjects" className="ghost-btn">Retour</Link>
              <Link to={`/subjects/edit/${subject?.id}`} className="primary-btn">
                Modifier
              </Link>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}

export default SubjectDetails;