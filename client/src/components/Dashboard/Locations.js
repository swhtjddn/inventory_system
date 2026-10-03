import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";

import Loader from "../Loader";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(null);

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

  const updateLocations = (index) => {
    const newLocations = locations.slice();
    newLocations.splice(index, 1);

    setLocations(newLocations);
  };

  const handleDelete = async (id, index, name) => {
    if (window.confirm(`Are you sure you want to remove location ${name}?`))
      await axios
        .delete("/api/locations/" + id)
        .then((res) => {
          updateLocations(index);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const displayLocations = () => {
    return locations.map((location, index) => {
      return (
        <tr key={location._id}>
          <td>{location.name}</td>
          <td>
            <button
              className="delete-btn"
              onClick={() => handleDelete(location._id, index, location.name)}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Locations</h1>
        <Link className="add-btn" to="/app/locations/add">
          Add Location
        </Link>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{displayLocations()}</tbody>
        </table>
      )}
    </div>
  );
};

export default Locations;
