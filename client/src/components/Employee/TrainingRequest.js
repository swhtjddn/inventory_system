import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const TrainingRequest = (props) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleRequest = (e) => {
    e.preventDefault();

    const requestData = {
      requester: props.auth.username,
      subject,
      description,
      location: props.auth.location,
    };

    if (window.confirm(`Requesting training ${subject}. Are you sure?`)) {
      axios
        .post("/api/training/request", requestData)
        .then((res) => {
          setSubmissionSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
        });
    }
  };

  const render = () => {
    return (
      <div>
        <header className="content-header">
          <h1>Training Request Form</h1>
        </header>
        <form onSubmit={handleRequest} className="product-form" method="POST">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            required
          />
          <textarea
            className="lashfix-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Describe the training you would like"
            required
          />
          <button disabled={submissionSuccess} type="submit">
            {submissionSuccess ? "Thanks" : "Submit"}
          </button>
        </form>
      </div>
    );
  };

  return <>{!props.auth ? <Redirect to="/" /> : render()}</>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(TrainingRequest);
