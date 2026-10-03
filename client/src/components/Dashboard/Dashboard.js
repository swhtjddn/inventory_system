import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import Loader from "../Loader";
import axios from "axios";

const Card = (props) => {
  return (
    <div
      className={
        props.loading ? "dashboard-card loading-card" : "dashboard-card"
      }
    >
      {props.children}
    </div>
  );
};

const Dashboard = (props) => {
  const [requestCount, setRequestCount] = useState(0);
  const [fulfilledCount, setFulfilledCount] = useState(0);
  const [unfulfilledCount, setUnfulfilledCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/dashboard")
      .then((res) => {
        setRequestCount(res.data.requestCount);
        setFulfilledCount(res.data.fulfilledCount);
        setUnfulfilledCount(res.data.unfulfilledCount);
        setEmployeesCount(res.data.employeesCount);
        setProductsCount(res.data.productCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <header className="content-header">
        <h1>Hi, {props.auth.username}</h1>
      </header>
      <div className="dashboard-container">
        {loading ? (
          <>
            <Card loading={true}>
              {" "}
              <Loader />{" "}
            </Card>
            <Card loading={true}>
              {" "}
              <Loader />{" "}
            </Card>
            <Card loading={true}>
              {" "}
              <Loader />{" "}
            </Card>
          </>
        ) : (
          <>
            <Card>
              <h2>Requests</h2>
              <p className="fulfill-stat">Requests: {requestCount}</p>
              <p className="fulfill-stat">Fulfilled: {fulfilledCount}</p>
              <p className="unfulfilled">{unfulfilledCount} pending requests</p>
            </Card>
            <Card>
              <h2>Employees</h2>
              <p className="dashboard-number">{employeesCount}</p>
            </Card>
            <Card>
              <h2>Products</h2>
              <p className="dashboard-number">{productsCount}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Dashboard);
