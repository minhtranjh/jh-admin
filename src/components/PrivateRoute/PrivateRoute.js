import React from "react";
import { Redirect, Route } from "react-router-dom";
const PrivateRoute = ({ component, ...rest }) => {
  
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;
  if (currentUser) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/login" />;
};
export default PrivateRoute;
