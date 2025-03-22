const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  uname: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
