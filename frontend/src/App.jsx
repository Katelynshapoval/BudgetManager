import Login from "./pages/Login/Login";
import Proveedores from "./pages/Suppliers/Suppliers.jsx";
import Budget from "./pages/Budget/Budget.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import History from "./pages/History/History.jsx";
import Usuarios from "./pages/Users/Users.jsx";
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
            <Route index element={<Budget />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="ordenes" element={<Orders />} />
            <Route path="historico" element={<History />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
