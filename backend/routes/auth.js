const express = require("express");
const router = express.Router();
const User = require("../models/Users");
// Add Valdiator
const { query, body, validationResult } = require('express-validator');

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
router.post("/createuser", [
  body('name', 'Name should not be empty').notEmpty(),
  body('email', 'Enter a valid email').notEmpty().isEmail(),
  body('password', 'Password should atleast of 3 digits').notEmpty().isLength({min: 3})
],async(req, res) => {
  // If there are erros return bad request (400) & error
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({errors: result.array()})
  }

  try {
    let user = await User.findOne({email: req.body.email}) 
 //console.log(user)
  if (user) {
    return res.status(400).json({error: "Sorry user with this email already exists!"})
  }
  // Check if user with same email exists already
 user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  })

  res.json(user)
  } catch (error){
    console.error(error.message)
    res.status(500).send("Some error occured")
  }
 // Check whether user with this email exists already
 
  
  // .then(user=> res.json(user))
  // .catch(err => console.log(err))
});

module.exports = router;
