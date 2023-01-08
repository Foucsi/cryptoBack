const mongoose = require("mongoose");

const favoritesCrypto = mongoose.Schema({
  crypto: String,
});

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  favoritesCrypto: [favoritesCrypto],
});

const User = mongoose.model("users", userSchema);
module.exports = User;
