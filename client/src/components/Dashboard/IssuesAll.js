import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

import Loader from "../Loader";
import DatePicker from "react-datepicker";
import { startOfDay, endOfDay, isValid, format } from "date-fns";

const IssuesView = (props) => {
  const [issues, setIssues] = useState([]);
  const [dateError, setDateError] = useState(null);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(null);

  // helper function to verify dates
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

  // View all lash fixes
  const handleAll = () => {
    axios
      .get("/api/issues")
      .then((res) => {
        setIssues(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // View specified lash fixes
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
      .post("/api/issues", query)
      .then((res) => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  };

  // display issue count
  const issuesCount = () => {
    let lateCancellations = issues.filter(
      (issue) => issue.issueType === "late_cancel"
    ).length;
    let noShows = issues.filter(
      (issue) => issue.issueType === "no_show"
    ).length;
    let complaints = issues.filter(
      (issue) => issue.issueType === "complaint"
    ).length;

    return (
      <div>
        <h3>Late Cancellations: {lateCancellations}</h3>
        <h3>No-shows: {noShows}</h3>
        <h3>Complaints: {complaints}</h3>
      </div>
    );
  };

  // display all issues
  const renderIssues = () => {
    return issues.map((issue, index) => {
      let date = new Date(issue.dateRequested);
      return (
        <div className="user-request-card" key={issue._id}>
          <h3 className="user-requester">{issue.requester}</h3>

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
            <ul>{issue.clientName}</ul>
          </div>
          <div className="user-request-items">
            <h3>Issue</h3>
            <ul>{issue.issueType}</ul>
          </div>
          <div className="user-request-items">
            <h3>Description</h3>
            <ul>{issue.description}</ul>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Issues</h1>
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
        <button onClick={handleAll}>All Requests</button>
        <div>
          <p className="date-error">{dateError ? dateError : null}</p>
        </div>
      </div>

      <h2>Issues Count</h2>
      <div>{issuesCount()}</div>
      <h2>
        Issues for {isValid(startDate) ? format(startDate, "MM/dd/yyyy") : "_"}{" "}
        - {isValid(endDate) ? format(endDate, "MM/dd/yyyy") : "______"}
      </h2>
      <div className="user-request-container">
        {loading ? <Loader /> : issues ? renderIssues() : null}
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(IssuesView);
