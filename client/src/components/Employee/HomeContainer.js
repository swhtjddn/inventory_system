import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

import HomePage from "./HomePage";
import Request from "./Request";
import LashFix from "./LashFix";
import Training from "./Training";
import TrainingRequest from "./TrainingRequest";
import MyLashFixes from "./MyLashFixes";
import Suggestion from "./Suggestion";
import ViewSuggestions from "./ViewSuggestions";

const routes = [
  {
    path: "/home",
    exact: true,
    sidebar: () => <div>Home</div>,
    main: () => <HomePage />,
  },
  {
    path: "/home/request",
    exact: true,
    sidebar: () => <div>Requests</div>,
    main: () => <Request />,
  },
  {
    path: "/home/lashfix",
    exact: true,
    sidebar: () => <div>Lash Fix</div>,
    main: () => <LashFix />,
  },
  {
    path: "/home/trainings",
    exact: true,
    sidebar: () => <div>Trainings</div>,
    main: () => <Training />,
  },
  {
    path: "/home/suggestion",
    exact: true,
    sidebar: () => <div>Suggestions</div>,
    main: () => <Suggestion />,
  },
];

const HomeContainer = (props) => {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  let activeTab = "sidebar-link sidebar-link-active";
  let defaultTab = "sidebar-link";

  let handleSignOut = () => {
    if (window.confirm(`Are you sure you want to logout?`)) {
      window.location.href = "/api/logout";
    }
  };

  const render = () => {
    return (
      <div className="app-container">
        <div className="side-bar">
          <div className="header-top">
            <div className="logo-container">
              <h1>Lash Dreams</h1>
            </div>
          </div>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="nav-toggle"
            aria-label="toggle navigation"
          >
            <span className="hamburger"></span>
          </button>
          <div>
            <ul className="side-bar-nav">
              <div className="nav-links">
                <Link
                  className={
                    location.pathname === "/home" ? activeTab : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/home"
                >
                  Home
                </Link>
                <Link
                  className={
                    location.pathname === "/home/request"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/home/request"
                >
                  Requests
                </Link>
                <Link
                  className={
                    location.pathname === "/home/lashfix"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/home/lashfix"
                >
                  Lash Fix
                </Link>
                <Link
                  className={
                    location.pathname === "/home/training"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/home/trainings"
                >
                  Trainings
                </Link>
                <Link
                  className={
                    location.pathname === "/home/suggestion"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/home/suggestion"
                >
                  Suggestion
                </Link>
                <button
                  onClick={handleSignOut}
                  className="sidebar-link sidebar-btn"
                >
                  Log Out
                </button>
              </div>
            </ul>
          </div>
        </div>
        <div className="main-content">
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            ))}
            <Route
              path="/home/trainings/request"
              exact
              children={() => <TrainingRequest />}
            ></Route>
            <Route
              path="/home/lashfix/mylashfixes"
              exact
              children={() => <MyLashFixes />}
            ></Route>
            <Route
              path="/home/suggestion/all-suggestions"
              exac
              children={() => <ViewSuggestions />}
            ></Route>
          </Switch>
        </div>
      </div>
    );
  };

  return <>{!props.auth ? <Redirect to="/" /> : render()}</>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(HomeContainer);
