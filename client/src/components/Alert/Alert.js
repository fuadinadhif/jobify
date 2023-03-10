import React from "react";

import { useAppContext } from "../../hooks/use-app-context";

function Alert() {
  const { alertType, alertText } = useAppContext();

  return <div className={`alert alert-${alertType}`}>{alertText}</div>;
}

export default Alert;
