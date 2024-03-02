const express = require("express");
const router = express.Router();
const User = require("../models/Users");
// Add Valdiator
const { query, body, validationResult } = require("express-validator");
// Password protector
var bcrypt = require("bcryptjs");
//add jwt = token generation
var jwt = require("jsonwebtoken");
// Secret ID for token generation
require("dotenv").config();
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET;
//import middleware
const fetchUser = require("../middleware/fetchUser");
const { configDotenv } = require("dotenv");

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

// ROUTE 1: Create a User using: POST "/api/auth/createuser". Doesn't require Authentication
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
        email: req.body.email.toLowerCase(),
      });

      // once created, return token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
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

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". Doesn't require Authentication
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
    //console.log("Body Password: ", password);
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      //console.log("user object: ", user);
      if (!user) {
        return res.status(400).json({ error: "Invalid Email" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      //console.log("passwordCompare: ", passwordCompare);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid Password" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get logged in user details using: POST "/api/auth/getUser". Login required
//Middleware gets called everytime there is a request on route. We need to call next() in middleware so that next middleware gets called.
// So in this case middleware is fetchUser and next middleware/function is async(req,res)
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //Select everything except password
    res.send(user);
    //console.log(user);
  } catch (error) {
    //console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
