const express = require("express");
const router = express.Router();
const User = require("../models/Users");

router.get("/", (req, res) => {
  obj = [
    {
      a: "Jonathen Godetti",
      number: +497789654123,
      age: 46,
    },
    {
      a: "Clark Oloffson",
      number: +465468746890,
      age: 31,
    },
  ];
  res.json(obj);
});

router.get("/signup", (req, res) => {
  res.send("Hello this is sign up");
});

// Create a User using: POST "/api/auth/". Doesn't require Authentication
router.post("/", (req, res) => {
  console.log(req.body);
  const userData = User(req.body);
  userData.save();
  res.send(req.body);
});

module.exports = router;
