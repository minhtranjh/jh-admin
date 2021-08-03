import React, { useEffect } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { checkIfUserLoggedIn } from "./redux/actions/auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignOutPage from "./pages/SignUpPage/SignUpPage";
import Layout from "./components/Layout/Layout";
import MemberPage from "./pages/MemberPage/MemberPage";
import PositionPage from "./pages/PositionPage/PositionPage";
import TeamPage from "./pages/TeamPage/TeamPage";
import UserPage from "./pages/UserPage/UserPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
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
  }, [isAuthenticated]);
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={SignInPage} />
        <Route exact path="/signup" component={SignOutPage} />
        <Layout>
          <PrivateRoute exact path="/" component={MemberPage} />
          <PrivateRoute path="/position" component={PositionPage} />
          <PrivateRoute path="/team" component={TeamPage} />
          <PrivateRoute path="/user" component={UserPage} />
        </Layout>
        <Route  path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;
