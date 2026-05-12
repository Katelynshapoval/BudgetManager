import Login from "./pages/Login/Login";
import Proveedores from "./pages/Proveedores/Proveedores";
import Presupuesto from "./pages/Presupuesto/Presupuesto";
import Ordenes from "./pages/Ordenes/Ordenes";
import Historico from "./pages/Historico/Historico";
import Usuarios from "./pages/Usuarios/Usuarios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";
import Signup from "./pages/Signup/Signup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Show toast notifications */}
        <Toaster position="top-center" />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected dashboard routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard pages */}
            <Route index element={<Presupuesto />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="historico" element={<Historico />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
