const mongoose = require("mongoose");

const lashfixSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  originalArtist: {
    type: String,
    default: "admin",
  },
  clientName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  commission: {
    type: Number,
    default: 0,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let Lashfix = mongoose.model("lashfix", lashfixSchema);

module.exports = Lashfix;
