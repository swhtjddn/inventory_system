import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import Loader from "../Loader";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";
import { startOfDay, endOfDay, isValid, format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

const TrainingAdd = (props) => {
  const [creator, setCreator] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(startOfDay(new Date()));
  const [startTime, setStartTime] = useState("");
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(6);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/locations")
      .then((res) => {
        setLocations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();

    // creator, title, description, attendees, date, startTime, location
    const trainingData = {
      creator: props.auth.username,
      title,
      description,
      date,
      startTime,
      maxCapacity,
      location,
    };

    if (window.confirm(`Are you sure you want to create training, ${title}`)) {
      axios
        .post("/api/trainings/add", trainingData)
        .then((res) => {
          history.push(res.data.redirectURL);
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
        <h1>Create Training</h1>
      </header>
      {/* creator, title, description, attendees, date, startTime, location */}
      <form onSubmit={handleAdd} className="product-form" method="POST">
        <input
          type="text"
          name="title"
          placeholder="Training Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          value={description}
          required
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Description of planned training"
        />
        <DatePicker
          placeholder="date"
          selected={date}
          onChange={(date) => setDate(date)}
        />
        <input
          type="text"
          name="time"
          placeholder="Start Time"
          value={startTime}
          required
          onChange={(e) => setStartTime(e.target.value)}
        ></input>
        <input
          type="number"
          name="maxCapacity"
          placeholder="Number of Students"
          value={maxCapacity}
          required
          onChange={(e) => setMaxCapacity(e.target.value)}
        />
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          required
        >
          {loading ? (
            <Loader />
          ) : (
            locations.map((location, index) => {
              return (
                <option key={index} value={location._id}>
                  {location.name}
                </option>
              );
            })
          )}
        </select>
        <button type="submit">Create Training</button>
      </form>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(TrainingAdd);
