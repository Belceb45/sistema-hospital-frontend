import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "./user-context";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { user,loading } = useUser();

  if(loading) return null;
  if (!user) return <Navigate to="/login" />;

  return children;
}
