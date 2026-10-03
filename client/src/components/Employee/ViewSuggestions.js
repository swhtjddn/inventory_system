import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const ViewSuggestions = (props) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios
      .get("/api/suggestions")
      .then((res) => {
        setSuggestions(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderSuggestions = () => {
    return suggestions.map((suggestion, index) => {
      let date = new Date(suggestion.dateRequested);
      return (
        <div className="user-request-card" key={suggestion._id}>
          <h3 className="user-requester">{suggestion.title}</h3>
          <div className="user-request-date">
            <h3>Date Requested</h3>
            <p>{date.toLocaleDateString("en-US")}</p>
          </div>
          <div className="user-request-date">
            <h3>Time Requested</h3>
            <p>{date.toLocaleTimeString()}</p>
          </div>
          <div className="user-request-items">
            <h3>Suggestion</h3>
            <ul>{suggestion.suggestion}</ul>
          </div>
          {suggestion.status === "complete" ? (
            <div className="user-request-items">COMPLETE</div>
          ) : suggestion.status === "in_progress" ? (
            <div className="user-request-items">In Progress</div>
          ) : (
            <div className="user-request-items">Not Reviewed</div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>All Suggestions</h1>
      </header>
      <div className="training-container">{renderSuggestions()}</div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(ViewSuggestions);
