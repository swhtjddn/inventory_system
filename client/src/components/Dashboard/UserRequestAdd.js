import React, { useEffect, useState } from "react";
import axios from "axios";

import Request from "../Helpers/Request";

const UserRequestAdd = (props) => {
  const [inventory, setInventory] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/employees")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setEmployee(e.target.value);
  };

  const displayEmployees = () => {
    return employees.map((user, index) => {
      return (
        <option key={index} value={user.username}>
          {user.username}
        </option>
      );
    });
  };

  const render = () => {
    return (
      <section className="request">
        <select value={employee} onChange={handleChange}>
          {loading ? null : displayEmployees()}
        </select>
        <Request employee={employee} />
      </section>
    );
  };

  return <>{render()}</>;
};

export default UserRequestAdd;
