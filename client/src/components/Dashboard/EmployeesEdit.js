import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";

const EmployeesEdit = () => {
  const [loading, setLoading] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  let { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/locations")
      .then((res) => {
        setLocations(res.data);
        setLocation(res.data[0]._id);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/employees/" + id)
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();

    const userData = {
      username,
      location,
    };

    if (window.confirm(`Are you sure you want to edit this employee`)) {
      axios
        .patch("/api/employees/" + id, userData)
        .then((res) => {
          history.push(res.data.redirectURL);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
        });
    }
  };

  console.log(location);
  return (
    <div>
      <header className="content-header">
        <h1>Edit Employee</h1>
      </header>

      <form onSubmit={handleEdit} className="product-form" method="POST">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
          required
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
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
        <button type="submit">Edit User</button>
      </form>
    </div>
  );
};

export default EmployeesEdit;
