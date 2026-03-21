import { useState } from "react";
import Login from "./pages/Login/Login";
import Proveedores from "./pages/Proveedores/Proveedores";
import Presupuesto from "./pages/Presupuesto/Presupuesto";
import Ordenes from "./pages/Ordenes/Ordenes";
import Historico from "./pages/Historico/Historico";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Presupuesto />} />
          <Route path="/dashboard/proveedores" element={<Proveedores />} />
          <Route path="/dashboard/ordenes" element={<Ordenes />} />
          <Route path="/dashboard/historico" element={<Historico />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
