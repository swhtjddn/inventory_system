import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

import Loader from "../Loader";

const Suggestions = (props) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/suggestions")
      .then((res) => {
        setSuggestions(res.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStatusChange = (e, index) => {
    let newSuggestions = [...suggestions];
    newSuggestions[index].status = e.target.value;

    setSuggestions(newSuggestions);
  };

  // update individual suggestions
  const handleClick = async (id, index) => {
    const patchData = {
      status: suggestions[index].status,
    };

    await axios
      .patch("/api/suggestion/" + id, patchData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // display all suggestions
  const renderSuggestions = () => {
    return suggestions.map((suggestion, index) => {
      let date = new Date(suggestion.dateRequested);
      return (
        <div className="user-request-card" key={suggestion._id}>
          <h3 className="user-requester">{suggestion.title}</h3>
          <div className="user-request-items">
            <h3>{suggestion.requester}</h3>
          </div>
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
          <select
            value={suggestion.status}
            onChange={(e) => handleStatusChange(e, index)}
          >
            {suggestion.status === "in_progress" ? (
              <>
                <option value="not_reviewed">Not Reviewed</option>
                <option disabled value="in_progress">
                  In Progress
                </option>
                <option value="complete">Complete</option>
              </>
            ) : suggestion.status === "complete" ? (
              <>
                <option value="not_reviewed">Not Reviewed</option>
                <option value="in_progress">In Progress</option>
                <option disabled value="complete">
                  Complete
                </option>
              </>
            ) : (
              <>
                <option disabled value="not_reviewed">
                  Not Reviewed
                </option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
              </>
            )}
          </select>
          <button
            type="submit"
            onClick={() => handleClick(suggestion._id, index)}
            className="user-request-btn"
          >
            Change Status
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Suggestions</h1>
      </header>

      <div className="training-container">
        {loading ? <Loader /> : suggestions ? renderSuggestions() : null}
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Suggestions);
