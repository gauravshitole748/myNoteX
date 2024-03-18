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

// ROUTE 3: Update a note using: PUT "/api/notes/updatenote/:id". Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  // take tag, description & title from body
  const { title, description, tag } = req.body;
  //title && console.log("title is available");

  // create newNote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be updated & update
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not found");
  }

  //find the user
  if (note.user != req.user.id) {
    return res.status(401).send("Not Authorized!");
  }

  // perform an update
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(note);
});

// ROUTE 4: Delete a note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  //find the note to be deleted & delete
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not found");
  }

  //find the user
  if (note.user != req.user.id) {
    return res.status(401).send("Not Authorized!");
  }

  // perform deletion
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ Success: "Note has been deleted", note: note });
});

module.exports = router;
