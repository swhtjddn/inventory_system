const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
            default: 'employee'
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        dateAdded: {
            type: Date,
            default: Date.now
        }
    },
)

let Item = mongoose.model('inventory', itemSchema)

module.exports = Item;