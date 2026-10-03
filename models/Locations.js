const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

let Locations = mongoose.model("location", locationSchema);

module.exports = Locations;
