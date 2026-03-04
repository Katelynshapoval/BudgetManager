import { useState } from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import Proveedor from "./pages/Proveedor/Proveedor";
import Presupuesto from "./pages/Presupuesto/Presupuesto";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Presupuesto />} />
          <Route path="/dashboard/proveedor" element={<Proveedor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
