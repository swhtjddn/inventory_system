import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

import Loader from "../Loader";
import DatePicker from "react-datepicker";
import { startOfDay, endOfDay, isValid, format } from "date-fns";

const MyLashFixes = (props) => {
  const [lashFixes, setLashFixes] = useState([]);
  const [dateError, setDateError] = useState(null);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(null);

  const verifyDates = (dates) => {
    const { start, end } = dates;
    if (!isValid(start)) {
      setDateError("Pick a start date");
      return false;
    }
    if (!isValid(end)) {
      setDateError("Pick an end date");
      return false;
    }
    if (start > end) {
      setDateError("End date must be after the start date");
      return false;
    }
    setDateError("");
    return true;
  };

  // handle all lash fixes
  const handleAll = () => {
    axios
      .get("/api/mylashfixes")
      .then((res) => {
        setLashFixes(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // handle specificed lash fixes
  const handleDate = () => {
    const query = {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    };

    if (!verifyDates(query)) {
      return;
    }

    setLoading(true);

    axios
      .post("/api/mylashfixes", query)
      .then((res) => {
        setLashFixes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  };

  const renderFixes = () => {
    return lashFixes.map((lashfix, index) => {
      let date = new Date(lashfix.dateRequested);
      return (
        <div className="user-request-card" key={lashfix._id}>
          <h3 className="user-requester">{lashfix.requester}</h3>
          <div className="user-request-date">
            <h3>Date Requested</h3>
            <p>{date.toLocaleDateString("en-US")}</p>
          </div>
          <div className="user-request-date">
            <h3>Time Requested</h3>
            <p>{date.toLocaleTimeString()}</p>
          </div>
          <div className="user-request-items">
            <h3>Client's Name</h3>
            <ul>{lashfix.clientName}</ul>
          </div>
          <div className="user-request-items">
            <h3>Description</h3>
            <ul>{lashfix.description}</ul>
          </div>
          {lashfix.reviewed ? (
            <div className="user-request-items">
              <h3>Commission</h3>
              <ul>${lashfix.commission}</ul>
            </div>
          ) : (
            "Not Reviewed"
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>My Lash Fix Requests</h1>
      </header>
      <div className="stats-datepicker">
        <p>Issues in selected date range</p>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <span className="stats-to">TO</span>
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        <button onClick={handleDate}>Specific Dates</button>
        <p>OR</p>
        <button onClick={handleAll}>All Fixes</button>
        <div>
          <p className="date-error">{dateError ? dateError : null}</p>
        </div>
      </div>

      <h2>Lash Fix Count</h2>
      <div>{lashFixes.count}</div>
      <h2>
        Lash Fixes for{" "}
        {isValid(startDate) ? format(startDate, "MM/dd/yyyy") : "_"} -{" "}
        {isValid(endDate) ? format(endDate, "MM/dd/yyyy") : "______"}
      </h2>

      <div className="training-container">{renderFixes()}</div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(MyLashFixes);
