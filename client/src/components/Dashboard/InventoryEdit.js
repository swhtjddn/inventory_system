import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const InventoryEdit = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  let { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    axios
      .get("/api/inventory/" + id)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
        setQuantity(res.data.quantity);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();

    const itemData = {
      name,
      description,
      quantity,
    };

    if (window.confirm(`Are you sure you want to edit this product`)) {
      axios
        .patch("/api/inventory/" + id, itemData)
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
        <h1>Edit Product</h1>
      </header>

      <form onSubmit={handleEdit} className="product-form" method="POST">
        <input
          type="text"
          name="name"
          placeholder="new product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="new description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="new quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Edit Product</button>
      </form>
    </div>
  );
};

export default InventoryEdit;
