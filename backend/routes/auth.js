const express = require("express");
const router = express.Router();
const User = require("../models/Users");
// Add Valdiator
const { query, body, validationResult } = require("express-validator");
// Password protector
var bcrypt = require("bcryptjs");
//add jwt = token generation
var jwt = require("jsonwebtoken");

// ---------- Routes ---------------

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
router.post(
  "/createuser",
  [
    body("name", "Name should not be empty").notEmpty(),
    body("email", "Enter a valid email").notEmpty().isEmail(),
    body("password", "Password should atleast of 3 digits")
      .notEmpty()
      .isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are erros return bad request (400) & error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      //Check if user with same email exists already
      let user = await User.findOne({ email: req.body.email });
      //console.log(user)
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exists!" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      // once created, return token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, secPass);
      res.json({ authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
    // Check whether user with this email exists already

    // .then(user=> res.json(user))
    // .catch(err => console.log(err))
  }
);

// Authenticate a user: POST "/api/auth/". Doesn't require Authentication
router.post(
  "/login",
  [
    body("email", "Enter valid email").notEmpty(),
    body("password", "Password should not be blank").notEmpty(),
  ],
  async (req, res) => {
    // If there are erros return bad request (400) & error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, password);
      res.json({ authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
