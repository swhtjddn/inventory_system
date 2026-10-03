import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

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

  const handleClick = async (id, index) => {
    const patchData = {
      attendee: props.auth.username,
    };

    await axios
      .patch("/api/trainings/" + id, patchData)
      .then((res) => {
        changeTraining(index);
        console.log(trainings[index].attendees);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  // const changeRequest = (index) => {
  //   const newRequests = requests.slice();
  //   newRequests[index].fulfilled = true;
  //   newRequests[index].fulfilledBy = props.auth.username;
  //   setRequests(newRequests);
  // };

  const changeTraining = (index) => {
    const newTrainings = trainings.slice();
    newTrainings[index].attendees.push(props.auth.username);
    setTrainings(newTrainings);
  };

  const renderTrainings = () => {
    return trainings.map((training, index) => {
      let date = new Date(training.date);
      return (
        <div className="training-card" key={training._id}>
          <h3 className="training-title">{training.title}</h3>
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
          {training.attendees.includes(props.auth.username) ? (
            "Registered"
          ) : training.attendees.length >= training.maxCapacity ? (
            "Class is Full"
          ) : (
            <button
              onClick={() => handleClick(training._id, index)}
              className="training-btn"
            >
              Register
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Trainings</h1>
        <Link className="add-btn" to="/home/trainings/request">
          Request Training
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
