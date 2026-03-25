import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { departmentService, getImageUrl } from "../services/entityService";

function DepartmentDetails() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const data = await departmentService.getById(id);
        setDepartment(data?.data || null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [id]);

  const imageUrl = getImageUrl(department?.image);

  return (
    <AppLayout title="Détail département">
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
                alt={department?.nom}
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
            <h2>{department?.nom || "Sans nom"}</h2>
            <p><strong>Histoire :</strong> {department?.histoire || "—"}</p>

            <div className="form-actions">
              <Link to="/departments" className="ghost-btn">Retour</Link>
              <Link
                to={`/departments/edit/${department?.id}`}
                className="primary-btn"
              >
                Modifier
              </Link>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}

export default DepartmentDetails;