const { validationResult } = require("express-validator");

const Note = require("../models/note");

const { unlink } = require("../utils/unlink");

exports.getAllNotes = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalNotes;
  let totalPages;
  Note.find().countDocuments().then((total) => {
    totalNotes = total;
    totalPages = Math.ceil(totalNotes / 6);
  })
  return Note.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(6)
    .then((notes) => {
      return res.status(200).json({notes, totalNotes, totalPages});
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Data not found.",
      });
    });
};

exports.createNewNote = (req, res, next) => {
  const { title, content } = req.body;
  const cover_image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed.",
      errorDetail: errors.array(),
    });
  }
  Note.create({
    title,
    content,
    cover_image: cover_image ? cover_image.path : null,
  })
    .then(() => {
      res.status(201).json({
        message: "Note created",
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: "Something went wrong.",
      });
    });
};

exports.getSingleNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      return res.status(422).json({
        message: "Something went wrong.",
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id).then((note) => {
    if(note.cover_image) {
      unlink(note.cover_image);
    }
  });
  return Note.findByIdAndDelete(id)
    .then((result) => {
      return res.status(204).json({
        message: "Note deleted.",
      });
    })
    .catch((err) => {
      return res.status(422).json({
        message: "Something went wrong.",
      });
    });
};

exports.getEditNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      return res.status(422).json({
        message: "Something went wrong.",
      });
    });
};

exports.updateNote = (req, res, next) => {
  const { title, content, note_id } = req.body;
  const cover_image = req.file;
  Note.findById(note_id)
    .then((note) => {
      note.title = title;
      note.content = content;
      if(cover_image) {
        if(note.cover_image) {
          unlink(note.cover_image);
        }
        note.cover_image = cover_image.path;
      }
      return note.save();
    })
    .then(() => {
      return res.status(200).json({
        message: "Note updated.",
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: "Something went wrong.",
      });
    });
};
