const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows React to talk to this server
app.use(express.json()); // Allows the server to read JSON data

/// 1. Database Connection (Cloud Atlas)
const DB_URI = "mongodb+srv://allimamalararivudainambi:MyNotessaver2026@cluster0.foh83nf.mongodb.net/notes_db?appName=Cluster0";

mongoose.connect(DB_URI)
    .then(() => console.log("🚀 ✅ Connected to Cloud MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Note Schema & Model
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

// 3. API Routes

// GET: Fetch all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes" });
    }
});

// POST: Create a new note
app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: "Error saving note" });
    }
});

// PUT: Update an existing note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: "Error updating note" });
    }
});

// DELETE: Remove a note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: "Note not found" });
    }
});

// 4. Start Server
// 4. Start Server
const PORT = 5000;
// Using '0.0.0.0' allows the server to accept requests from your network IP
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running and accessible at http://10.36.241.12:${PORT}`);
});