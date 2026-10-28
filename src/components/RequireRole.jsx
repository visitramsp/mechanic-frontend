import { Navigate } from "react-router-dom";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("users") || "{}"); } catch { return {}; }
};

export default function RequireRole({ roles, children }) {
  if (!roles?.length) return children;
  const user = readUser();
  return roles.includes(user?.role) ? children : <Navigate to="/dashboard" replace />;
}
