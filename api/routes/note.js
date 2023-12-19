const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const noteController = require("../controllers/note");

const authMiddleware = require("../middlewares/is-auth");

router.get("/notes", noteController.getAllNotes);

router.post(
  "/create",
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short!")
      .isLength({ max: 30 })
      .withMessage("Title is too long!"),
    body("content")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Content is too short!"),
  ], authMiddleware,
  noteController.createNewNote
);

router.get("/notes/:id", noteController.getSingleNote);

router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

router.get("/edit/:id", noteController.getEditNote);

router.put("/edit", authMiddleware, noteController.updateNote);

module.exports = router;
