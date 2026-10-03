import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Training = (props) => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    axios
      .get("/api/trainings")
      .then((res) => {
        setTrainings(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateTrainings = (index) => {
    const newTrainings = trainings.slice();
    newTrainings.splice(index, 1);

    setTrainings(newTrainings);
  };

  const handleDelete = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      await axios
        .delete("/api/trainings/" + id)
        .then((res) => {
          updateTrainings(index);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderTrainings = () => {
    return trainings.map((training, index) => {
      let date = new Date(training.date);
      return (
        <div className="training-card" key={training._id}>
          <h3 className="training-title">{training.title}</h3>
          <div className="training-delete">
            <button
              className="delete-btn"
              onClick={() => handleDelete(training._id, index)}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </button>
          </div>
          <div className="training-date">
            <h3>Date</h3>
            <p>{date.toLocaleDateString("en-US")}</p>
          </div>
          <div className="training-date">
            <h3>Start Time</h3>
            <p>{training.startTime}</p>
          </div>
          <div className="training-description">
            <h3>Description</h3>
            <p>{training.description}</p>
          </div>
          <div className="training-description">
            <h3>Max Capacity</h3>
            <p>{training.maxCapacity}</p>
          </div>
          <div className="training-items">
            <h3>Attendees</h3>
            <div>
              {training.attendees.length === 0 ? (
                "None"
              ) : (
                <ul>
                  {training.attendees.map((attendee, index) => {
                    return (
                      <li className="training-attendee" key={index}>
                        {attendee}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Trainings</h1>
        <Link className="add-btn" to="/app/trainings/add">
          Add Trainings
        </Link>
        <Link className="add-btn" to="/app/trainings/requests">
          Training Requests
        </Link>
      </header>
      <div className="training-container">{renderTrainings()}</div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Training);
