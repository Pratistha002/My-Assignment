const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const adminRoutes = require('./routes/admin'); // ✅ Admin routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', authRoutes);          // /api/signup, /api/login
app.use('/api/stores', storeRoutes);  // /api/stores endpoints
app.use('/api/admin', adminRoutes);   // /api/admin endpoints (stats, users, etc.)

// Optional: Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Optional: Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
