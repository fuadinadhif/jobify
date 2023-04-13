import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../hooks/context/use-app-context";

function GoBack() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, [navigate, user]);

  return null;
}

function UnprotectedRoute({ children }) {
  const { user } = useAppContext();

  return <>{user ? <GoBack /> : children}</>;
}

export default UnprotectedRoute;
