import { useState } from "react";
import Login from "./pages/Login/Login";
import Proveedores from "./pages/Proveedores/Proveedores";
import Presupuesto from "./pages/Presupuesto/Presupuesto";
import Ordenes from "./pages/Ordenes/Ordenes";
import Historico from "./pages/Historico/Historico";
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
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Presupuesto />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="historico" element={<Historico />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
