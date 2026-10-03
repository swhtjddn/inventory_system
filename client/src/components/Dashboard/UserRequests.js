import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const UserRequests = (props) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("/api/request")
      .then((res) => {
        setRequests(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const changeRequest = (index) => {
    const newRequests = requests.slice();
    newRequests[index].fulfilled = true;
    newRequests[index].fulfilledBy = props.auth.username;
    setRequests(newRequests);
  };

  const handleClick = async (id, items, index) => {
    const patchData = {
      fulfilledBy: props.auth.username,
      items,
    };

    await axios
      .patch("/api/request/" + id, patchData)
      .then((res) => {
        changeRequest(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateRequests = (index) => {
    const newRequests = requests.slice();
    newRequests.splice(index, 1);

    setRequests(newRequests);
  };

  const handleDelete = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this request")) {
      await axios
        .delete("/api/request/" + id)
        .then((res) => {
          updateRequests(index);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderRequests = () => {
    return requests.map((request, index) => {
      let date = new Date(request.dateRequested);
      return (
        <div className="user-request-card" key={request._id}>
          <h3 className="user-requester">{request.requester}</h3>
          <div className="request-delete">
            <button
              className="delete-btn"
              onClick={() => handleDelete(request._id, index)}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </button>
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
            <h3>Products</h3>
            <ul>
              {request.items.map((item) => {
                return (
                  <li className="user-request-item" key={item}>
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="user-request-btn-container">
            {request.fulfilled ? (
              <div className="user-fulfilled">Fulfilled</div>
            ) : (
              <button
                onClick={() => handleClick(request._id, request.items, index)}
                className="user-request-btn"
              >
                Fulfill Request
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
        <h1>Requests</h1>
        <Link className="add-btn" to="/app/request/add">
          Add Request
        </Link>
      </header>
      <div className="user-request-container">{renderRequests()}</div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(UserRequests);
