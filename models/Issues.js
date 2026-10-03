const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  issueType: {
    type: String,
    required: true,
    default: "",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let Request = mongoose.model("issues", issueSchema);

module.exports = Request;
