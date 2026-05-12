import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
