import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "L'email est obligatoire.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Format d'email invalide.";
    }

    if (!mot_de_passe.trim()) {
      nextErrors.mot_de_passe = "Le mot de passe est obligatoire.";
    }

    return nextErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mot_de_passe,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          setServerError(data.errors.map((item) => item.msg).join(" | "));
        } else {
          setServerError(data.message || "Erreur de connexion");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      dispatch(loginSuccess(data.token));
      navigate("/subjects", { replace: true });
    } catch (error) {
      setLoading(false);
      setServerError("Erreur connexion backend");
      console.log(error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/subjects" replace />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Connexion</h1>

      <form onSubmit={handleLogin} style={{ display: "inline-block", minWidth: 320 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
            setServerError("");
          }}
          style={{ width: "100%", padding: 10 }}
        />
        {errors.email && (
          <p style={{ color: "red", marginTop: 6, marginBottom: 10, textAlign: "left" }}>
            {errors.email}
          </p>
        )}

        <br />

        <input
          type="password"
          placeholder="Mot de passe"
          value={mot_de_passe}
          onChange={(e) => {
            setMotDePasse(e.target.value);
            setErrors((prev) => ({ ...prev, mot_de_passe: "" }));
            setServerError("");
          }}
          style={{ width: "100%", padding: 10 }}
        />
        {errors.mot_de_passe && (
          <p style={{ color: "red", marginTop: 6, marginBottom: 10, textAlign: "left" }}>
            {errors.mot_de_passe}
          </p>
        )}

        {serverError && (
          <p style={{ color: "red", marginTop: 10, marginBottom: 10 }}>{serverError}</p>
        )}

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Compte test : powell@gmail.com / mot de passe de la base
      </p>
    </div>
  );
}

export default Login;
