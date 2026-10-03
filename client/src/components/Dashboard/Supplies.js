import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";
import Loader from "../Loader";

const Supplies = (props) => {
  const [inventory, setInventory] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/inventory")
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleRequest = (e) => {
    e.preventDefault();

    const items = [];

    for (let i = 0; i < e.target.length; i++) {
      if (e.target[i].type === "checkbox") {
        if (e.target[i].checked === true) {
          items.push(e.target[i].name);
        }
      }
    }

    const supplyData = {
      requester: props.auth.username,
      location: props.auth.location,
      items,
    };

    if (window.confirm(`Need more ${items.join(", ")}. Are you sure?`)) {
      axios
        .post("/api/supplies/add", supplyData)
        .then((res) => {
          setSubmissionSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
        });
    }
  };

  const renderCheckboxes = () => {
    const misc = [];

    inventory.forEach((item) => {
      if (item.description === "tools") {
        misc.push(item);
      }
      if (item.description === "bathroom") {
        misc.push(item);
      }
    });

    return (
      <>
        <h3 className="request-category">Restock Supplies</h3>
        {misc.map((item) => {
          return (
            <label
              className={
                item.quantity > 0
                  ? "request-label"
                  : "request-label disabled-item"
              }
              key={item._id}
            >
              <input
                className="request-check"
                disabled={item.quantity > 0 ? submissionSuccess : true}
                name={item.name}
                type="checkbox"
              />
              {item.name}
            </label>
          );
        })}
      </>
    );
  };

  const render = () => {
    return (
      <div>
        <header className="content-header">
          <h1>Supplies Request</h1>
        </header>
        <section className="request">
          <div className="request-container">
            <form onSubmit={handleRequest} className="request-form">
              {loading ? (
                <div>
                  <Loader />
                </div>
              ) : (
                <div className="request-checkboxes">{renderCheckboxes()}</div>
              )}

              <button disabled={submissionSuccess} type="submit">
                {submissionSuccess ? "Thanks" : "Submit"}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  };

  return <>{render()}</>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Supplies);
