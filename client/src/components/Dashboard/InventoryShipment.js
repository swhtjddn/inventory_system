import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const InventoryShipment = () => {
    const [inventory, setInventory] = useState([]);
    const [shipment, setShipment] = useState([]);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        axios
            .get('/api/inventory')
            .then(res => {

                const sortedInv = res.data;
                sortedInv.sort(function (a, b) {
                    let textA = a.name.toUpperCase();
                    let textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                setInventory(res.data);
                setShipment(res.data.map(item => {
                    const { _id } = item;
                    return { _id, value: 0 };
                }))

                setLoading(false);

            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleChange = (index, e) => {
        let newShipment = [...shipment];
        newShipment[index].value = Number(e.target.value);

        setShipment(newShipment);
    }

    const handleClick = () => {
        if (window.confirm(`Confirm your shipment`)) {
            axios
            .patch('/api/inventory/shipment', shipment)
            .then(res => {
                history.push(res.data.redirectURL);
            })
            .catch(err => {
                console.log(err);
                console.log(err.response);
            })
        }
    }

    const displayInventory = () => {
        return (
            inventory.map((item, index) => {
                return (
                    <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td><input
                            onChange={(e) => handleChange(index, e)}
                            placeholder="product amount"
                            type="number"
                            value={ loading ? "" : shipment[index].value }
                        /></td>
                    </tr> 
                )
            })
        ) 
    }

    return (
        <div>
            <header className="content-header">
                <h1>New Shipment</h1>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Shipment Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {displayInventory()}
                </tbody>
            </table>
            <div>
                <button onClick={handleClick}>Update</button>
            </div>
        </div>
    )
}

export default InventoryShipment;