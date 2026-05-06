const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to accept JSON data in the body

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/loads', require('./routes/loadRoutes'));
app.use('/api/driver', require('./routes/driverRoutes'));


// Basic route for testing
app.get('/', (req, res) => {
  res.send('CargoLink API is running...');
});

// Mapbox Token Route
app.get('/api/config/mapbox', (req, res) => {
  res.json({ token: process.env.VITE_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN });
});

// Global Error Handler (Express 5 catches async errors automatically and forwards them here)
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('Body:', req.body);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
