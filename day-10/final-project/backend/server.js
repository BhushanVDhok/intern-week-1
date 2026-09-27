const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const facilityRoutes    = require('./src/routes/facilityRoutes');
const inspectionRoutes  = require('./src/routes/inspectionRoutes');
const complaintRoutes   = require('./src/routes/complaintRoutes');
const db                = require('./src/models/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status:             'healthy',
    system:             'Smart Facility Management API',
    postgres_connected: db.isPostgresConnected(),
    timestamp:          new Date().toISOString()
  });
});

// Routes
app.use('/api/facilities',  facilityRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/complaints',  complaintRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`  Smart Facility Management API running on http://localhost:${PORT}`);
  console.log('  Routes: /api/facilities  /api/inspections  /api/complaints');
  console.log('================================================================');
});

module.exports = app;
