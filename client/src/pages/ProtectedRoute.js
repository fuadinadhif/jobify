import { Navigate } from "react-router-dom";

import { useAppContext } from "../hooks/context/use-app-context";
import Loading from "../components/Loading";

function ProtectedRoute({ children }) {
  const { user, isUserLoading } = useAppContext();

  if (isUserLoading) {
    return (
      <Loading
        center="center"
        style={{ position: "absolute", top: "45%", right: 0, left: 0 }}
      />
    );
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return children;
}

export default ProtectedRoute;
