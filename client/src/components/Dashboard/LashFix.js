import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import Loader from "../Loader";
import DatePicker from "react-datepicker";
import { startOfDay, endOfDay, isValid, format } from "date-fns";

const LashFix = (props) => {
  const [lashFixes, setLashFixes] = useState([]);
  const [dateError, setDateError] = useState(null);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [loading, setLoading] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employees, setEmployees] = useState([]);

  // get list of employees on load
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

  // helper function to verify dates
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

  // update front end to match backend
  const changeLashFix = (index) => {
    const newLashFixes = lashFixes.slice();
    newLashFixes[index].reviewed = true;
    newLashFixes[index].reviewedBy = props.auth.username;
    setLashFixes(newLashFixes);
  };

  const updateLashFix = (index) => {
    const newLashFixes = lashFixes.slice();
    newLashFixes.splice(index, 1);

    setLashFixes(newLashFixes);
  };

  // delete lash fix
  const handleDelete = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this lash fix")) {
      await axios
        .delete("/api/lashfix/" + id)
        .then((res) => {
          updateLashFix(index);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // set commissions
  const handleChange = (e, index) => {
    let newLashFixes = [...lashFixes];
    newLashFixes[index].commission = Number(e.target.value);

    setLashFixes(newLashFixes);
  };

  // set original artist
  const handleEmployeeChange = (e, index) => {
    let newLashFixes = [...lashFixes];
    newLashFixes[index].originalArtist = e.target.value;

    setLashFixes(newLashFixes);
  };

  // display list of employees
  const displayEmployees = () => {
    return employees.map((user, index) => {
      return (
        <option key={index} value={user.username}>
          {user.username}
        </option>
      );
    });
  };

  // update individual lash fixes
  const handleClick = async (id, index) => {
    const patchData = {
      reviewedBy: props.auth.username,
      commissionSplit: lashFixes[index].commission,
      originalArtist: lashFixes[index].originalArtist,
    };

    await axios
      .patch("/api/lashfix/" + id, patchData)
      .then((res) => {
        changeLashFix(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // View all lash fixes
  const handleAll = () => {
    axios
      .get("/api/allfixes")
      .then((res) => {
        setLashFixes(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // View specified lash fixes
  const handleDate = () => {
    const query = {
      start: startOfDay(startDate),
      end: endOfDay(endDate),
    };

    if (!verifyDates(query)) {
      return;
    }

    setLoading(true);

    axios
      .post("/api/lashfix", query)
      .then((res) => {
        setLashFixes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  };

  // display commission splits
  const displayCommission = () => {
    let commissions = [];
    employees.forEach((element) => {
      commissions.push({ employee: element, commission: 0 });
    });

    lashFixes.forEach((fix) => {
      if (typeof fix.commission === "undefined") {
        return;
      } else {
        commissions[
          commissions.findIndex(
            (employee) => employee.employee.username === fix.requester
          )
        ].commission += fix.commission;

        commissions[
          commissions.findIndex(
            (employee) => employee.employee.username === fix.originalArtist
          )
        ].commission -= fix.commission;
      }
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission, index) => {
            if (commission.commission !== 0) {
              return (
                <tr key={commission.employee._id}>
                  <td>{commission.employee.username}</td>
                  <td>{commission.commission}</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
    );
  };

  // display all lashfixes
  const renderLashFixes = () => {
    return lashFixes.map((lashfix, index) => {
      let date = new Date(lashfix.dateRequested);
      return (
        <div className="user-request-card" key={lashfix._id}>
          <h3 className="user-requester">{lashfix.requester}</h3>
          <div className="request-delete">
            <button
              className="delete-btn"
              onClick={() => handleDelete(lashfix._id, index)}
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </button>
          </div>
          <div className="user-request-items">
            <h3>Original Artist</h3>
            <ul>{lashfix.originalArtist}</ul>
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
            <h3>Client's Name</h3>
            <ul>{lashfix.clientName}</ul>
          </div>
          <div className="user-request-items">
            <h3>Description</h3>
            <ul>{lashfix.description}</ul>
          </div>
          <div className="user-request-items">
            <h3>Commission</h3>
            <ul>{lashfix.commission ? lashfix.commission : null}</ul>
          </div>

          <div className="user-request-btn-container">
            {lashfix.reviewed ? (
              <div className="user-fulfilled">Reviewed</div>
            ) : (
              <>
                <select
                  value={lashFixes[index].originalArtist}
                  onChange={(e) => handleEmployeeChange(e, index)}
                >
                  {loading ? null : displayEmployees()}
                </select>
                <input
                  type="number"
                  name="commission"
                  placeholder="commission split"
                  value={lashFixes[index].commission}
                  onChange={(e) => handleChange(e, index)}
                  required
                ></input>
                <button
                  type="submit"
                  onClick={() => handleClick(lashfix._id, index)}
                  className="user-request-btn"
                >
                  Review Lash Fix
                </button>
              </>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <header className="content-header">
        <h1>Lash Fixes</h1>
      </header>
      <div className="stats-datepicker">
        <p>Lash Fixes in selected date range</p>
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

        <button onClick={handleDate}>Specific Dates</button>
        <p>OR</p>
        <button onClick={handleAll}>All Requests</button>
        <div>
          <p className="date-error">{dateError ? dateError : null}</p>
        </div>
      </div>
      <h2>Commission Splits</h2>
      <div>{displayCommission()}</div>

      <h2>
        Lash Fixes for{" "}
        {isValid(startDate) ? format(startDate, "MM/dd/yyyy") : "_"} -{" "}
        {isValid(endDate) ? format(endDate, "MM/dd/yyyy") : "______"}
      </h2>
      <div className="user-request-container">
        {loading ? <Loader /> : lashFixes ? renderLashFixes() : null}
      </div>
    </div>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(LashFix);
