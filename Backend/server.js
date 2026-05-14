const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const notesRouter = require('./routes/notes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // must be before routes

// JSON parse error handler (body-parser / express.json)
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    console.error('Invalid JSON payload:', err.message || err);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// health
app.get('/', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api/notes', notesRouter);

// connect DB
const mongoUri =
  process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesdb';

async function connectDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
connectDB();

// start server
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set PORT env or free the port and retry.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});