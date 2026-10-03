import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const TrainingRequests = (props) => {
  const [trainingRequests, setTrainingRequests] = useState([]);

  useEffect(() => {
    axios
      .get("/api/trainings/requests")
      .then((res) => {
        setTrainingRequests(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = async (id, index) => {
    const patchData = {
      reviewedBy: props.auth.username,
    };

    await axios
      .patch("/api/training/request/" + id, patchData)
      .then((res) => {
        changeTrainingRequests(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeTrainingRequests = (index) => {
    const newTrainingRequests = trainingRequests.slice();
    newTrainingRequests[index].reviewed = true;
    newTrainingRequests[index].reviewedBy = props.auth.username;
    setTrainingRequests(newTrainingRequests);
  };

  const updateTrainings = (index) => {
    const newTrainings = trainingRequests.slice();
    newTrainings.splice(index, 1);

    setTrainingRequests(newTrainings);
  };

  const handleDelete = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      await axios
        .delete("/api/trainings/" + id)
        .then((res) => {
          updateTrainings(index);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderTrainings = () => {
    return trainingRequests.map((trainingRequests, index) => {
      let date = new Date(trainingRequests.dateRequested);
      return (
        <div className="training-card" key={trainingRequests._id}>
          <h3 className="training-title">{trainingRequests.subject}</h3>
          <div className="training-delete">
            <button
              className="delete-btn"
              onClick={() => handleDelete(trainingRequests._id, index)}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </button>
          </div>
          <div className="training-description">
            <h3>Requester</h3>
            <p>{trainingRequests.requester}</p>
          </div>
          <div className="training-description">
            <h3>Description</h3>
            <p>{trainingRequests.description}</p>
          </div>
          <div className="training-date">
            <h3>Date Requested</h3>
            <p>{date.toLocaleDateString("en-US")}</p>
          </div>
          <div className="user-request-btn-container">
            {trainingRequests.reviewed ? (
              <div className="user-fulfilled">Reviewed</div>
            ) : (
              <button
                onClick={() => handleClick(trainingRequests._id, index)}
                className="user-request-btn"
              >
                Review Request
              </button>
            )}
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
      </header>
      <div className="training-container">{renderTrainings()}</div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(TrainingRequests);
