import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const LashFix = (props) => {
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleLashfix = (e) => {
    e.preventDefault();

    const lashfixData = {
      requester: props.auth.username,
      location: props.auth.location,
      clientName: clientName,
      description: description,
    };

    if (window.confirm(`Submitting Lash Fix. Are you sure?`)) {
      axios
        .post("/api/lashfix/add", lashfixData)
        .then((res) => {
          setSubmissionSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
        });
    }
  };

  const renderMessage = () => {
    return (
      <>
        {submissionSuccess
          ? "Lash Fix Received, Thank you!"
          : "Fill out for appropriate commission splits"}
      </>
    );
  };

  return (
    <div>
      <header className="content-header">
        <h1>Lash Fix Request</h1>
        <Link className="add-btn" to="/home/lashfix/mylashfixes">
          View Lash Fixes
        </Link>
      </header>

      <form onSubmit={handleLashfix} className="product-form">
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
          placeholder="Please provide as much detail as possible including: time spent, etc."
        />
        <button disabled={submissionSuccess} type="submit">
          Submit
        </button>
        {renderMessage}
      </form>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(LashFix);
