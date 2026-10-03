import React, { useState, useEffect } from "react";
import axios from "axios";

import Loader from "../Loader";

const Register = () => {
  const [loading, setLoading] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleLogin = (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      role,
      location,
    };

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    console.log(location);

    if (
      window.confirm(`Are you sure you want to register ${role} ${username}`)
    ) {
      axios
        .post("/register", userData)
        .then((res) => {
          setUsername("");
          setPassword("");
          setConfirmPassword("");
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
        <h1>Register Employee</h1>
      </header>
      <section className="signup-page">
        <form onSubmit={handleLogin} className="signup-form" method="POST">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorMsg("");
            }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg("");
            }}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMsg("");
            }}
            required
          />
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrorMsg("");
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
              setErrorMsg("");
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
          <p className={"error-msg"}>{errorMsg}</p>
          <button type="submit">Register</button>
        </form>
      </section>
    </div>
  );
};

export default Register;
