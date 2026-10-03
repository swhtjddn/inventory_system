import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { connect } from "react-redux";
import * as actions from "../actions";

import Loader from "./Loader";
import LoginPage from "./LoginPage";
import HomeContainer from "./Employee/HomeContainer";
import DashboardContainer from "./Dashboard/DashboardContainer";
import ResetPassword from "./ResetPassword";

const App = (props) => {
  const { fetchUser } = props;
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser().then((res) => {
      setLoading(false);
    });
  }, [fetchUser]);

  const render = () => {
    if (props.auth) {
      if (props.auth.role === "employee") {
        return <Redirect to="/home" />;
      }
      if (props.auth.role === "admin") {
        return <Redirect to="/app" />;
      }
    } else {
      return <LoginPage />;
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading-container">
          {" "}
          <Loader />{" "}
        </div>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/">
              {render()}
            </Route>
            <Route path="/app">
              <DashboardContainer />
            </Route>
            <Route path="/home">
              <HomeContainer />
            </Route>
            <Route path="/resetpassword">
              <ResetPassword />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(App);
