import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Laboratories from "./pages/Laboratories";
import Users from "./pages/Users";
import Subjects from "./pages/Subjects";
import SubjectForm from "./pages/SubjectForm";
import SubjectDetails from "./pages/SubjectDetails";
import Departments from "./pages/Departments";
import DepartmentForm from "./pages/DepartmentForm";
import DepartmentDetails from "./pages/DepartmentDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/entities.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/laboratories"
          element={
            <ProtectedRoute>
              <Laboratories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/add"
          element={
            <ProtectedRoute>
              <SubjectForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <ProtectedRoute>
              <SubjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/edit/:id"
          element={
            <ProtectedRoute>
              <SubjectForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments/add"
          element={
            <ProtectedRoute>
              <DepartmentForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments/:id"
          element={
            <ProtectedRoute>
              <DepartmentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments/edit/:id"
          element={
            <ProtectedRoute>
              <DepartmentForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;