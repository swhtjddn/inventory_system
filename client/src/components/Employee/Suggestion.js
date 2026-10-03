import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const Suggestion = (props) => {
  const [title, setTitle] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSuggestion = (e) => {
    e.preventDefault();

    const suggestionData = {
      requester: props.auth.username,
      location: props.auth.location,
      title: title,
      suggestion: suggestion,
    };

    if (window.confirm(`Submitting suggestion. Are you sure?`)) {
      axios
        .post("/api/suggestion/add", suggestionData)
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
          ? "Suggestion Received, Thank you!"
          : "Fill out for any suggestions for management"}
      </>
    );
  };

  return (
    <div>
      <header className="content-header">
        <h1>Suggestions</h1>
        <Link className="add-btn" to="/home/suggestion/all-suggestions">
          View Suggestions
        </Link>
      </header>

      <form onSubmit={handleSuggestion} className="product-form">
        <input
          type="text"
          name="title"
          placeholder="Subject"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />
        <textarea
          className="lashfix-description"
          value={suggestion}
          onChange={(e) => {
            setSuggestion(e.target.value);
          }}
          placeholder="Please describe in detail any improvements we can make for you"
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

export default connect(mapStateToProps, actions)(Suggestion);
