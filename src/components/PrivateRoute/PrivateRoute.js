import React from "react";
import { Redirect, Route } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;
  if (currentUser) {
    return <Route {...rest} component={Component} />;
  }
  return <Redirect to="/login" />;
};
export default PrivateRoute;
