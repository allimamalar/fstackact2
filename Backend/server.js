const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
   origin: process.env.FRONTEND_URL, // Ensure this matches your Vercel Environment Variable
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true
}));
app.use(express.json());

// 1. Database Connection
const DB_URI = "mongodb+srv://allimamalararivudainambi:MyNotessaver2026@cluster0.foh83nf.mongodb.net/notes_db?appName=Cluster0";

mongoose.connect(DB_URI)
    .then(() => console.log("🚀 ✅ Connected to MongoDB Atlas"))
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

// DELETE: Remove a note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: "Note not found" });
    }
});

// 4. Start Server (Vercel uses process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});