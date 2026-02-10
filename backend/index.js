const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "https://credify-amber.vercel.app/",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Credify API is running',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      issuers: '/api/issuers',
      credentials: '/api/credentials',
      verify: '/api/verify'
    }
  });
});

// API Routes (to be added)
app.use('/api/students', require('./routes/studentRoutes'));
// Add this line with other routes
app.use('/api/issuers', require('./routes/issuerRoutes'));
// Add this line with other routes
app.use('/api/credentials', require('./routes/credentialRoutes'));
// app.use('/api/issuers', require('./routes/issuerRoutes'));
// app.use('/api/credentials', require('./routes/credentialRoutes'));
// app.use('/api/verify', require('./routes/verifyRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  3
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
