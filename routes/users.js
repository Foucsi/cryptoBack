var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* get all users*/
router.get("/getUsers", (req, res) => {
  User.find()
    .then((data) => {
      if (!data) {
        res.status(404).json({ result: false, eroor: "User not found" });
      }
      res.json({ result: true, users: data });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

/* get user by token */
router.get("/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({ token })
    .then((data) => {
      if (!data) {
        res.status(404).json({ result: false, error: "User not found" });
      }
      res.json({ result: true, user: data });
    })
    .catch((err) => {
      res.status(500).json({ result: false, error: err });
    });
});

/* register new user */
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: username,
        email: email,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((data) => {
        res.json({ result: true, user: data });
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

module.exports = router;
