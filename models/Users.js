const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "employee",
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
});

userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

let User = mongoose.model("users", userSchema);

module.exports = User;
