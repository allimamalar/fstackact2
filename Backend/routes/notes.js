const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('GET /api/notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { title = '', content = '' } = req.body || {};
    const note = new Note({ title, content });
    const saved = await note.save();
    // return the saved document (includes _id, timestamps)
    return res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/notes error:', err);
    return res.status(500).json({ error: 'Failed to save note' });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/notes/:id error:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Note.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/notes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;