import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const InventoryAdd = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);

  const history = useHistory();

  const handleAdd = (e) => {
    e.preventDefault();

    const itemData = {
      name,
      description,
      quantity,
    };

    if (
      window.confirm(
        `Are you sure you want to add ${quantity} ${
          quantity > 1 ? `${name}s` : name
        }`
      )
    ) {
      axios
        .post("/api/inventory/add", itemData)
        .then((res) => {
          history.push(res.data.redirectURL);
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
        <h1>Add Product</h1>
      </header>

      <form onSubmit={handleAdd} className="product-form" method="POST">
        <input
          type="text"
          name="name"
          placeholder="product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="add a short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="initial quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default InventoryAdd;
