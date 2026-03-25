import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  nom: yup.string().min(2, "Nom trop court").required("Nom obligatoire"),
  salle: yup.string().min(1, "Salle obligatoire").required("Salle obligatoire"),
  information: yup
    .string()
    .min(3, "Information trop courte")
    .required("Information obligatoire"),
});

function Laboratories() {
  const [laboratories, setLaboratories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: "",
      salle: "",
      information: "",
    },
  });

  const fetchLaboratories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/laboratories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLaboratories(res.data.data.laboratories);
    } catch (error) {
      alert("Erreur chargement laboratories");
    }
  };

  useEffect(() => {
    fetchLaboratories();
  }, []);

  const onSubmit = async (formData) => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/laboratories/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const body = new FormData();
        body.append("nom", formData.nom);
        body.append("salle", formData.salle);
        body.append("information", formData.information);

        await axios.post("http://localhost:5000/api/laboratories", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      reset({
        nom: "",
        salle: "",
        information: "",
      });
      setEditingId(null);
      fetchLaboratories();
    } catch (error) {
      alert("Erreur enregistrement laboratory");
    }
  };

  const handleEdit = (lab) => {
    setEditingId(lab.id);
    reset({
      nom: lab.nom || "",
      salle: lab.salle || "",
      information: lab.information || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/laboratories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLaboratories();
    } catch (error) {
      alert("Erreur suppression laboratory");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <AppLayout title="Laboratoires">
      <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Laboratories</h1>
        <div className="d-flex gap-2">
        </div>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="mb-3">
          {editingId ? "Modifier un laboratoire" : "Ajouter un laboratoire"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input className="form-control" {...register("nom")} />
            <div className="text-danger small mt-1">{errors.nom?.message}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Salle</label>
            <input className="form-control" {...register("salle")} />
            <div className="text-danger small mt-1">
              {errors.salle?.message}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Information</label>
            <textarea className="form-control" {...register("information")} />
            <div className="text-danger small mt-1">
              {errors.information?.message}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {editingId ? "Modifier" : "Ajouter"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                reset({
                  nom: "",
                  salle: "",
                  information: "",
                });
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <div className="row">
        {laboratories.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning">Aucun laboratoire trouvé.</div>
          </div>
        ) : (
          laboratories.map((lab) => (
            <div className="col-md-6 mb-3" key={lab.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title">{lab.nom}</h4>
                  <p className="mb-2">
                    <strong>Salle :</strong> {lab.salle}
                  </p>
                  <p className="mb-3">
                    <strong>Information :</strong> {lab.information}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(lab)}
                    >
                      Modifier
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(lab.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </AppLayout>
  );
}

export default Laboratories;