import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({children}) {
  const { loading, accessToken } = useAuth();
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default PublicRoute;
