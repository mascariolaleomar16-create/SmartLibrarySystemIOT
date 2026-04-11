import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  // 🔥 If already logged in → block access
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}