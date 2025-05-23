const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const adminRoutes = require('./routes/admin'); 


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

 app.use(cors());
  app.use(express.json());

// API Routes
app.use('/api', authRoutes);          
app.use('/api/stores', storeRoutes);  
app.use('/api/admin', adminRoutes);   

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
