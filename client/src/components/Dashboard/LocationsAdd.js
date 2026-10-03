import React, { useState } from "react";
import axios from "axios";

const LocationsAdd = () => {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    const locationData = {
      name,
    };

    if (window.confirm(`Are you sure you want to add location ${name}`)) {
      axios
        .post("/api/locations/add", locationData)
        .then((res) => {
          setName("");
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
        <h1>Register Location</h1>
      </header>
      <section className="signup-page">
        <form onSubmit={handleRegister} className="signup-form" method="POST">
          <input
            type="text"
            name="name"
            placeholder="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg("");
            }}
            required
          />
          <p className={"error-msg"}>{errorMsg}</p>
          <button type="submit">Register</button>
        </form>
      </section>
    </div>
  );
};

export default LocationsAdd;
