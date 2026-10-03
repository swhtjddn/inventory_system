const mongoose = require("mongoose");

const trainingRequestScheme = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  dateReviewed: {
    type: Date,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  reviewedBy: {
    type: String,
    default: "",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let TrainingRequest = mongoose.model("trainingRequests", trainingRequestScheme);

module.exports = TrainingRequest;
