import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";
import DatePicker from "react-datepicker";
import { startOfDay, endOfDay, isValid, format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

const Statistics = () => {
  const [dateError, setDateError] = useState(null);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(null);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(null);
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]);

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

  const verifyDates = (dates) => {
    const { start, end } = dates;
    if (!isValid(start)) {
      setDateError("Pick a start date");
      return false;
    }
    if (!isValid(end)) {
      setDateError("Pick an end date");
      return false;
    }
    if (start > end) {
      setDateError("End date must be after the start date");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleClick = () => {
    const query = {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
      employee: employee,
    };

    if (!verifyDates(query)) {
      return;
    }

    setLoading(true);

    axios
      .post("/api/stats", query)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  };

  const handleSalon = () => {
    const query = {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    };

    if (!verifyDates(query)) {
      return;
    }

    setLoading(true);

    axios
      .post("/api/salonstats", query)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  };

  const renderStats = () => {
    const items = {};
    requests.forEach((request) => {
      request.items.forEach((item) => {
        if (items.hasOwnProperty(item)) {
          items[item] += 1;
        } else {
          items[item] = 1;
        }
      });
    });

    const sortedItems = Object.keys(items)
      .sort()
      .reduce((obj, key) => {
        obj[key] = items[key];
        return obj;
      }, {});

    return (
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sortedItems).map((item, i) => {
            return (
              <tr key={i}>
                <td>{item}</td>
                <td>{items[item]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

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

  return (
    <div>
      <header className="content-header">
        <h1>Statistics</h1>
      </header>
      <div className="stats-datepicker">
        <p>Requests in selected date range</p>
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <span className="stats-to">TO</span>
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <p>Pick Employee</p>
        <div>
          <select value={employee} onChange={handleChange}>
            {loading ? null : displayEmployees()}
          </select>
        </div>
        <button onClick={handleClick}>Submit</button>
        <p>OR</p>
        <button onClick={handleSalon}>Calculate Total Salon Usage</button>
        <div>
          <p className="date-error">{dateError ? dateError : null}</p>
        </div>
      </div>
      <div className="stats">
        <h2>
          Stats for {isValid(startDate) ? format(startDate, "MM/dd/yyyy") : "_"}{" "}
          - {isValid(endDate) ? format(endDate, "MM/dd/yyyy") : "______"}
        </h2>
        {loading ? <Loader /> : requests ? renderStats() : null}
      </div>
    </div>
  );
};

export default Statistics;
