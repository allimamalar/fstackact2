const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const notesRouter = require('./routes/notes');

dotenv.config();

const app = express();

// 1. Setup Middleware
app.use(cors()); 
app.use(express.json()); 

// 2. JSON parse error handler
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// 3. Health check
app.get('/', (req, res) => res.json({ ok: true, message: "Backend is live!" }));

// 4. API routes
app.use('/api/notes', notesRouter);

// 5. Database Connection Logic
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; 
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

// 6. Connect to DB on every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// 7. Local Server setup
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  connectDB().then(() => {
    app.listen(port, () => console.log(`🚀 Local Server running on port ${port}`));
  });
}

module.exports = app;