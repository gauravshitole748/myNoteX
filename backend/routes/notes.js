const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
// Get notes model
const Notes = require("../models/Notes");
// Add Valdiator
const { query, body, validationResult } = require("express-validator");

// ROUTE 1: Get all Notes of logged in user using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    //res.send("Inside Fetch All Notes");
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Create a new note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title should not be empty").notEmpty(),
    body("description", "Description should not be empty").notEmpty(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = await new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      }).save();

      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
