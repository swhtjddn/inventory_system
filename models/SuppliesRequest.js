const mongoose = require("mongoose");

const suppliesSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  items: {
    type: [String],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

let Supplies = mongoose.model("supplies", suppliesSchema);

module.exports = Supplies;
