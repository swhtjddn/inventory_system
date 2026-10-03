import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/inventory")
      .then((res) => {
        setInventory(
          res.data.sort(function (a, b) {
            return a.name.localeCompare(b.name, undefined, {
              numeric: true,
              sensitivity: "base",
            });
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateInventory = (index) => {
    const newInventory = inventory.slice();
    newInventory.splice(index, 1);

    setInventory(newInventory);
  };

  const handleDelete = async (id, index) => {
    await axios
      .delete("/api/inventory/" + id)
      .then((res) => {
        updateInventory(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const displayInventory = () => {
    return inventory.map((item, index) => {
      return (
        <tr key={item._id}>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td>{item.quantity}</td>
          <td>
            <Link className="edit-btn" to={`/app/inventory/${item._id}`}>
              <FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon>
            </Link>
          </td>
          <td>
            <button
              className="delete-btn"
              onClick={() => handleDelete(item._id, index)}
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
        <h1>Inventory</h1>
        <Link className="shipment-btn" to="/app/inventory/shipment">
          New Shipment
        </Link>
        <Link className="add-btn" to="/app/inventory/add">
          Add Products
        </Link>
      </header>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{displayInventory()}</tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
