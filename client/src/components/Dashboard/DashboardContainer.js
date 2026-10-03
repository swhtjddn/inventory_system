import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Register from "./Register";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Employees from "./Employees";
import EmployeesEdit from "./EmployeesEdit";
import Statistics from "./Statistics";
import UserRequests from "./UserRequests";
import UserRequestAdd from "./UserRequestAdd";
import InventoryAdd from "./InventoryAdd";
import InventoryEdit from "./InventoryEdit";
import InventoryShipment from "./InventoryShipment";
import Locations from "./Locations";
import LocationsAdd from "./LocationsAdd";
import LashFix from "./LashFix";
import Training from "./Training";
import TrainingAdd from "./TrainingAdd";
import TrainingRequests from "./TrainingRequests";
import Supplies from "./Supplies";
import Issues from "./Issues";
import IssuesAll from "./IssuesAll";
import Suggestions from "./Suggestions";

const routes = [
  {
    path: "/app",
    exact: true,
    sidebar: () => <div>Dashboard</div>,
    main: () => <Dashboard />,
  },
  {
    path: "/app/inventory",
    exact: true,
    sidebar: () => <div>Inventory</div>,
    main: () => <Inventory />,
  },
  {
    path: "/app/employees",
    exact: true,
    sidebar: () => <div>Employees</div>,
    main: () => <Employees />,
  },
  {
    path: "/app/statistics",
    sidebar: () => <div>Statistics</div>,
    main: () => <Statistics />,
  },
  {
    path: "/app/register",
    sidebar: () => <div>Register</div>,
    main: () => <Register />,
  },
  {
    path: "/app/requests",
    sidebar: () => <div>Requests</div>,
    main: () => <UserRequests />,
  },
  {
    path: "/app/locations",
    exact: true,
    sidebar: () => <div>Locations</div>,
    main: () => <Locations />,
  },
  {
    path: "/app/lashfixes",
    exact: true,
    sidebar: () => <div>Lash Fixes</div>,
    main: () => <LashFix />,
  },
  {
    path: "/app/trainings",
    exact: true,
    sidebar: () => <div>Trainings</div>,
    main: () => <Training />,
  },
  {
    path: "/app/supplies",
    exact: true,
    sidebar: () => <div>Supplies</div>,
    main: () => <Supplies />,
  },
  {
    path: "/app/issues",
    exact: true,
    sidebar: () => <div>Issues</div>,
    main: () => <Issues />,
  },
  {
    path: "/app/suggestions",
    exact: true,
    sidebar: () => <div>Suggestions</div>,
    main: () => <Suggestions />,
  },
];

const DashboardContainer = (props) => {
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
                    location.pathname === "/app" ? activeTab : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app"
                >
                  Home
                </Link>
                <Link
                  className={
                    location.pathname === "/app/inventory"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/inventory"
                >
                  Inventory
                </Link>
                <Link
                  className={
                    location.pathname === "/app/employees"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/employees"
                >
                  Employees
                </Link>
                <Link
                  className={
                    location.pathname === "/app/statistics"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/statistics"
                >
                  Statistics
                </Link>
                <Link
                  className={
                    location.pathname === "/app/requests"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/requests"
                >
                  Requests
                </Link>
                <Link
                  className={
                    location.pathname === "/app/locations"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/locations"
                >
                  Locations
                </Link>
                <Link
                  className={
                    location.pathname === "/app/lashfixes"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/lashfixes"
                >
                  Lash Fixes
                </Link>
                <Link
                  className={
                    location.pathname === "/app/trainings"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/trainings"
                >
                  Trainings
                </Link>
                <Link
                  className={
                    location.pathname === "/app/supplies"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/supplies"
                >
                  Supplies
                </Link>
                <Link
                  className={
                    location.pathname === "/app/issues" ? activeTab : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/issues"
                >
                  Issues
                </Link>
                <Link
                  className={
                    location.pathname === "/app/suggestions"
                      ? activeTab
                      : defaultTab
                  }
                  onClick={() => setOpen((prev) => !prev)}
                  to="/app/suggestions"
                >
                  Suggestions
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
              path="/app/inventory/add"
              exact
              children={() => <InventoryAdd />}
            ></Route>
            <Route
              path="/app/inventory/shipment"
              exact
              children={() => <InventoryShipment />}
            ></Route>
            <Route
              path="/app/inventory/:id"
              children={() => <InventoryEdit />}
            ></Route>
            <Route
              path="/app/request/add"
              exact
              children={() => <UserRequestAdd />}
            ></Route>
            <Route
              path="/app/locations/add"
              exact
              children={() => <LocationsAdd />}
            ></Route>
            <Route
              path="/app/employees/:id"
              exact
              children={() => <EmployeesEdit />}
            ></Route>
            <Route
              path="/app/trainings/add"
              exact
              children={() => <TrainingAdd />}
            ></Route>
            <Route
              path="/app/trainings/requests"
              exact
              children={() => <TrainingRequests />}
            ></Route>
            <Route
              path="/app/issues/view"
              exact
              children={() => <IssuesAll />}
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

export default connect(mapStateToProps, actions)(DashboardContainer);
