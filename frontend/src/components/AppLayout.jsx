import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

function AppLayout({ title = "Tableau de bord", children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <h2>UA2</h2>
            <p>Frontend</p>
          </div>

          <nav className="sidebar-nav">
            <Link
              to="/subjects"
              className={isActive("/subjects") ? "nav-link active" : "nav-link"}
            >
              Matières
            </Link>

            <Link
              to="/departments"
              className={
                isActive("/departments") ? "nav-link active" : "nav-link"
              }
            >
              Départements
            </Link>

            <Link
              to="/laboratories"
              className={
                isActive("/laboratories") ? "nav-link active" : "nav-link"
              }
            >
              Laboratoires
            </Link>

            <Link
              to="/users"
              className={isActive("/users") ? "nav-link active" : "nav-link"}
            >
              Utilisateurs
            </Link>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Déconnexion
        </button>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <h1>{title}</h1>
        </header>

        <main className="page-content">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}

export default AppLayout;