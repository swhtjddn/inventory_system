import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import axios from "axios";

const Request = (props) => {
  const [inventory, setInventory] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  console.log(props.employee);

  useEffect(() => {
    if (props.auth) {
      axios
        .get("/api/inventory")
        .then((res) => {
          setInventory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.auth]);

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

    const requestData = {
      requester: props.auth.username,
      location: props.auth.location,
      items,
    };

    if (window.confirm(`Requesting ${items.join(", ")}. Are you sure?`)) {
      axios
        .post("/api/request/add", requestData)
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
    const shimmying = [];
    const pinching = [];
    const classic = [];
    const remainder = [];

    const ShimmyC = [];
    const ShimmyC03 = [];
    const ShimmyC05 = [];

    const ShimmyCC = [];
    const ShimmyCC03 = [];
    const ShimmyCC05 = [];

    const ShimmyD = [];
    const ShimmyD03 = [];
    const ShimmyD05 = [];

    const PinchC = [];
    const PinchC03 = [];
    const PinchC05 = [];

    const PinchCC = [];
    const PinchCC03 = [];
    const PinchCC05 = [];

    const PinchD = [];
    const PinchD03 = [];
    const PinchD05 = [];

    const C15 = [];
    const CC15 = [];
    const D15 = [];

    const glue = [];
    const misc = [];

    let c = / C /;
    let cc = /(CC)/;
    let d = /(D)/;
    let g = /(adhesive)/;
    let dia03 = /0.03/;
    let dia05 = /0.05/;
    let dia15 = /0.15/;

    inventory.forEach((item) => {
      if (item.description === "shimmying") {
        shimmying.push(item);
      } else if (item.description === "pinching") {
        pinching.push(item);
      } else if (item.description === "classic") {
        classic.push(item);
      } else {
        remainder.push(item);
      }
    });

    // Sorting Shimmying Lashes
    shimmying.forEach((item) => {
      if (c.test(item.name)) {
        ShimmyC.push(item);
      }
      if (cc.test(item.name)) {
        ShimmyCC.push(item);
      }
      if (d.test(item.name)) {
        ShimmyD.push(item);
      }
    });

    ShimmyC.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    ShimmyC.forEach((item) => {
      if (dia03.test(item.name)) {
        ShimmyC03.push(item);
      }
      if (dia05.test(item.name)) {
        ShimmyC05.push(item);
      }
    });

    ShimmyCC.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    ShimmyCC.forEach((item) => {
      if (dia03.test(item.name)) {
        ShimmyCC03.push(item);
      }
      if (dia05.test(item.name)) {
        ShimmyCC05.push(item);
      }
    });

    ShimmyD.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    ShimmyD.forEach((item) => {
      if (dia03.test(item.name)) {
        ShimmyD03.push(item);
      }
      if (dia05.test(item.name)) {
        ShimmyD05.push(item);
      }
    });

    // sorting pinching lashes
    pinching.forEach((item) => {
      if (c.test(item.name)) {
        PinchC.push(item);
      }
      if (cc.test(item.name)) {
        PinchCC.push(item);
      }
      if (d.test(item.name)) {
        PinchD.push(item);
      }
    });

    PinchC.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    PinchC.forEach((item) => {
      if (dia03.test(item.name)) {
        PinchC03.push(item);
      }
      if (dia05.test(item.name)) {
        PinchC05.push(item);
      }
    });

    PinchCC.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    PinchCC.forEach((item) => {
      if (dia03.test(item.name)) {
        PinchCC03.push(item);
      }
      if (dia05.test(item.name)) {
        PinchCC05.push(item);
      }
    });

    PinchD.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    PinchD.forEach((item) => {
      if (dia03.test(item.name)) {
        PinchD03.push(item);
      }
      if (dia05.test(item.name)) {
        PinchD05.push(item);
      }
    });

    // sorting classic lashes
    classic.forEach((item) => {
      if (c.test(item.name)) {
        C15.push(item);
      }
      if (cc.test(item.name)) {
        CC15.push(item);
      }
      if (d.test(item.name)) {
        D15.push(item);
      }
    });

    remainder.forEach((item) => {
      if (g.test(item.name)) {
        glue.push(item);
      }
      if (item.description === "tools") {
        misc.push(item);
      }
    });

    return (
      <>
        <h2 id="premium">Premium</h2>
        <h3 className="request-category">0.03 C Premium</h3>
        {ShimmyC03.map((item) => {
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
        <h3 className="request-category">0.05 C Premium</h3>
        {ShimmyC05.map((item) => {
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
        <h3 className="request-category">0.03 CC Premium</h3>
        {ShimmyCC03.map((item) => {
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
        <h3 className="request-category">0.05 CC Premium</h3>
        {ShimmyCC05.map((item) => {
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
        <h3 className="request-category">0.03 D Premium</h3>
        {ShimmyD03.map((item) => {
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
        <h3 className="request-category">0.05 D Premium</h3>
        {ShimmyD05.map((item) => {
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

        <h2 id="signature">Pinching</h2>
        <h3 className="request-category">0.03 C Signature</h3>
        {PinchC03.map((item) => {
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
        <h3 className="request-category">0.05 C Signature</h3>
        {PinchC05.map((item) => {
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
        <h3 className="request-category">0.03 CC Signature</h3>
        {PinchCC03.map((item) => {
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
        <h3 className="request-category">0.05 CC Signature</h3>
        {PinchCC05.map((item) => {
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
        <h3 className="request-category">0.03 D Signature</h3>
        {PinchD03.map((item) => {
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
        <h3 className="request-category">0.05 D Signature</h3>
        {PinchD05.map((item) => {
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
        {C15.length > 0 ? (
          <h3 className="request-category">0.15 C Classics</h3>
        ) : null}
        {C15.map((item) => {
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
        <h3 className="request-category">0.15 CC Classics</h3>
        {CC15.map((item) => {
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
        {D15.length > 0 ? (
          <h3 className="request-category">0.15 D Classics</h3>
        ) : null}
        {D15.map((item) => {
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

        <h3 id="adhesives" className="request-category">
          Lash Adhesives
        </h3>
        {glue.map((item) => {
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
        <h3 id="tools" className="request-category">
          Other Supplies
        </h3>
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

  const renderMessage = () => {
    return (
      <>
        {submissionSuccess
          ? "Submission Received, Thank you! Please log out"
          : "Fill this form out weekly to keep your supplies in stock!"}
      </>
    );
  };

  const render = () => {
    return (
      <section className="request employee-request">
        <div className="request-container">
          <p className="request-description">{renderMessage()}</p>
          <div className="request-buttons">
            <a href="#premium">P</a>
            <a href="#signature">S</a>
            <a href="#adhesives">G</a>
            <a href="#tools">T</a>
          </div>
          <form onSubmit={handleRequest} className="request-form">
            <div className="request-checkboxes">{renderCheckboxes()}</div>
            <button disabled={submissionSuccess} type="submit">
              {submissionSuccess ? "Thanks" : "Submit"}
            </button>
          </form>
        </div>
      </section>
    );
  };

  return <>{!props.auth ? <Redirect to="/" /> : render()}</>;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Request);
