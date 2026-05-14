const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const notesRouter = require('./routes/notes');

dotenv.config();

// Update CORS to trust your frontend once you have the URL
const express = require('express');
const cors = require('cors'); // 1. Require it first at the top
const app = express();

app.use(cors()); // 2. Then use it
app.use(express.json()); // 3. Then handle JSON

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// Health check
app.get('/', (req, res) => res.json({ ok: true, message: "Backend is live!" }));

// API routes
app.use('/api/notes', notesRouter);

// Database Connection Logic (Optimized for Serverless)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Use existing connection
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

// IMPORTANT: For Vercel, we don't call app.listen() in production.
// Vercel handles the execution.
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  connectDB().then(() => {
    app.listen(port, () => console.log(`🚀 Local Server running on port ${port}`));
  });
}

// Connect to DB on every request (Mongoose handles the caching)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export the app for Vercel
module.exports = app;