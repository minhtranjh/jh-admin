import React, { useEffect } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { checkIfUserLoggedIn } from "./redux/actions/auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignOutPage from "./pages/SignUpPage/SignUpPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import Layout from "./components/Layout/Layout";
import MemberPage from "./pages/MemberPage/MemberPage";
import PositionPage from "./pages/PositionPage/PositionPage";
import TeamPage from "./pages/TeamPage/TeamPage";
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    const checkIsAuthenticated = () => {
      if (!isAuthenticated) {
        dispatch(checkIfUserLoggedIn());
      }
    };
    checkIsAuthenticated();
  }, [dispatch]);
  return (
    <Router>
      <Route exact path="/login" component={SignInPage} />
      <Route exact path="/signup" component={SignOutPage} />
      <Layout>
        <PrivateRoute exact path="/" component={DashboardPage} />
        <PrivateRoute path="/member" component={MemberPage} />
        <PrivateRoute path="/position" component={PositionPage} />
        <PrivateRoute path="/team" component={TeamPage} />
      </Layout>
    </Router>
  );
}

export default App;
