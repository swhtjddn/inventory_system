const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  items: {
    type: [String],
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  dateFulfilled: {
    type: Date,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
  fulfilledBy: {
    type: String,
    default: "",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let Request = mongoose.model("requests", requestSchema);

module.exports = Request;
