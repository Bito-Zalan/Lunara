import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, profile, authLoading } = useAuth();

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  return children;
}
