const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);