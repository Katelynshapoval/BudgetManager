import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Proveedor from "./pages/Proveedor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Proveedor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
