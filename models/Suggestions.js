const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  suggestion: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "not_reviewed",
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let Suggestion = mongoose.model("suggestions", suggestionSchema);

module.exports = Suggestion;
