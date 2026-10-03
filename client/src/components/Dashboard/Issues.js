import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const Issues = (props) => {
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [issue, setIssue] = useState("late_cancel");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleIssue = (e) => {
    e.preventDefault();

    const issueData = {
      requester: props.auth.username,
      location: props.auth.location,
      clientName: clientName,
      description: description,
      issueType: issue,
    };

    if (window.confirm(`Submitting Issue. Are you sure?`)) {
      axios
        .post("/api/issue/add", issueData)
        .then((res) => {
          setSubmissionSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
        });
    }
  };

  return (
    <div>
      <header className="content-header">
        <h1>Issue Submission</h1>
        <Link className="add-btn" to="/app/issues/view">
          View Issues
        </Link>
      </header>

      <form onSubmit={handleIssue} className="product-form">
        <input
          type="text"
          name="clientName"
          placeholder="Client's first and last name"
          value={clientName}
          onChange={(e) => {
            setClientName(e.target.value);
          }}
          required
        />
        <textarea
          className="lashfix-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Please provide why the client had to late cancel. If no reason is given, or it was a no-show, you can leave blank"
        />
        <select
          value={issue}
          onChange={(e) => {
            setIssue(e.target.value);
          }}
          required
        >
          <option value="late_cancel">Late Cancellation</option>
          <option value="no_show">No Show</option>
          <option value="complaint">Complaint</option>
        </select>
        <button disabled={submissionSuccess} type="submit">
          {submissionSuccess ? "Thank You" : "Submit"}
        </button>
      </form>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Issues);
