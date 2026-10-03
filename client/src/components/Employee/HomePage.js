import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import Loader from "../Loader";
import axios from "axios";
import { startOfISOWeek, endOfISOWeek } from "date-fns";

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

const HomePage = (props) => {
  const [loading, setLoading] = useState(null);
  const [lashFixCount, setLashFixCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    const date = new Date();

    const query = {
      start: startOfISOWeek(date),
      end: endOfISOWeek(date),
      originalArtist: props.auth.username,
    };

    axios
      .post("/api/employeeDashboard", query)
      .then((res) => {
        setLashFixCount(res.data.lashFixCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.auth.username]);

  const handleCall = () => {
    const query = {
      requester: props.auth.username,
      location: props.auth.location,
    };

    console.log(query);

    if (window.confirm(`Are you sure you want to call the receptionist?`)) {
      axios
        .post("/api/callReceptionist", query)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <header className="content-header">
        <h1>
          Welcome Back,{" "}
          <span className="request-uppercase">{props.auth.username}</span>
        </h1>
      </header>
      <div className="receptionist-call">
        <button onClick={handleCall}>Call Receptionist</button>
      </div>
      <div className="dashboard-container">
        {loading ? (
          <>
            <Card loading={true}>
              {" "}
              <Loader />{" "}
            </Card>
          </>
        ) : (
          <>
            <Card>
              <h2>Lash Fixes This Week</h2>
              <p className="dashboard-number">{lashFixCount}</p>
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

export default connect(mapStateToProps, actions)(HomePage);
