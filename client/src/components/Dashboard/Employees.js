import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";

import Loader from "../Loader";

const Employees = () => {
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

  const updateEmployee = (index) => {
    const newEmployees = employees.slice();
    newEmployees.splice(index, 1);

    setEmployees(newEmployees);
  };

  const handleDelete = async (id, index, username) => {
    if (window.confirm(`Are you sure you want to remove employee ${username}?`))
      await axios
        .delete("/api/employees/" + id)
        .then((res) => {
          updateEmployee(index);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const displayEmployees = () => {
    return employees.map((employee, index) => {
      let date = new Date(employee.date);
      return (
        <tr key={employee._id}>
          <td>{employee.username}</td>
          <td>{employee.role}</td>
          <td>{date.toLocaleDateString("en-US")}</td>
          <td>
            <Link className="edit-btn" to={`/app/employees/${employee._id}`}>
              <FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon>
            </Link>
          </td>
          <td>
            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(employee._id, index, employee.username)
              }
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
        <h1>Employees</h1>
        <Link className="add-btn" to="/app/register">
          Add Employee
        </Link>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{displayEmployees()}</tbody>
        </table>
      )}
    </div>
  );
};

export default Employees;
