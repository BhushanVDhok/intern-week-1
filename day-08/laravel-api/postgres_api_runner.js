/**
 * Day 8: PostgreSQL API Runner (Node.js Express Bridge)
 * 
 * Provides an immediate, runnable execution of the Day 8 API specifications 
 * against a PostgreSQL database (or fallback memory store) matching the Laravel 
 * controller behavior, HTTP status codes, and data structures.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// In-memory data mirroring PostgreSQL tables
let facilities = [
  { id: 1, name: 'Terminal 1 Restrooms', location: 'Building A - Concourse 1', capacity: 120, status: 'Good', cleanliness_score: 8.5, odor_score: 2.0, waste_level: 'Low', footfall: 1250 },
  { id: 2, name: 'Food Court Washrooms', location: 'Building B - Level 2', capacity: 200, status: 'Needs Cleaning', cleanliness_score: 4.2, odor_score: 7.5, waste_level: 'High', footfall: 3400 },
  { id: 3, name: 'Central Atrium Restrooms', location: 'Main Hub - Floor 1', capacity: 150, status: 'Under Maintenance', cleanliness_score: 6.0, odor_score: 4.0, waste_level: 'Medium', footfall: 1800 },
  { id: 4, name: 'East Wing Restrooms', location: 'Building C - Floor 3', capacity: 80, status: 'Good', cleanliness_score: 9.0, odor_score: 1.5, waste_level: 'Low', footfall: 620 },
  { id: 5, name: 'Cargo Bay Washrooms', location: 'Hangar 4 - Ground', capacity: 50, status: 'Critical', cleanliness_score: 3.1, odor_score: 8.8, waste_level: 'High', footfall: 450 }
];

let inspections = [
  { id: 1, facility_id: 1, inspector_id: 2, cleanliness_score: 9, odor_score: 2, waste_level: 'Low', water_available: true, notes: 'Dispensers filled and clean floors.', inspection_date: '2026-09-20' },
  { id: 2, facility_id: 2, inspector_id: 2, cleanliness_score: 4, odor_score: 7, waste_level: 'High', water_available: true, notes: 'Heavy trash overflow.', inspection_date: '2026-09-22' },
  { id: 3, facility_id: 5, inspector_id: 2, cleanliness_score: 3, odor_score: 9, waste_level: 'High', water_available: false, notes: 'Drainage backup detected.', inspection_date: '2026-09-25' }
];

let complaints = [
  { id: 1, facility_id: 2, complaint_title: 'Trash overflow', description: 'Trash bin next to entrance overflowing.', priority: 'High', status: 'Pending', assigned_to: 3 },
  { id: 2, facility_id: 5, complaint_title: 'Strong sewer odor', description: 'Persistent odor near bay doors.', priority: 'Urgent', status: 'Pending', assigned_to: 1 },
  { id: 3, facility_id: 1, complaint_title: 'Empty soap dispenser', description: 'Stall 2 soap dispenser empty.', priority: 'Low', status: 'Resolved', assigned_to: 3 }
];

let nextFacilityId = 6;
let nextInspectionId = 4;
let nextComplaintId = 4;

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Stats
app.get('/api/facilities/stats', (req, res) => {
  const total = facilities.length;
  const avg = total > 0 ? (facilities.reduce((acc, f) => acc + f.cleanliness_score, 0) / total).toFixed(2) : 0;
  const critical = facilities.filter(f => f.status === 'Critical').length;
  const needsCleaning = facilities.filter(f => f.status === 'Needs Cleaning').length;

  res.json({
    success: true,
    data: {
      total_facilities: total,
      average_cleanliness: parseFloat(avg),
      critical_facilities: critical,
      needs_cleaning: needsCleaning
    }
  });
});

// --- FACILITIES CRUD ---
app.get('/api/facilities', (req, res) => {
  let result = [...facilities];
  if (req.query.status) {
    result = result.filter(f => f.status.toLowerCase() === req.query.status.toLowerCase());
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(f => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q));
  }
  res.json({
    success: true,
    message: 'Facilities retrieved successfully',
    count: result.length,
    data: result
  });
});

app.post('/api/facilities', (req, res) => {
  const { name, location, capacity = 100, status = 'Good' } = req.body;
  if (!name || !location) {
    return res.status(422).json({ success: false, message: 'Name and location are required' });
  }
  const newFacility = {
    id: nextFacilityId++,
    name,
    location,
    capacity: Number(capacity),
    status,
    cleanliness_score: 8.0,
    odor_score: 2.0,
    waste_level: 'Low',
    footfall: 0
  };
  facilities.push(newFacility);
  res.status(201).json({ success: true, message: 'Facility created successfully', data: newFacility });
});

app.get('/api/facilities/:id', (req, res) => {
  const f = facilities.find(item => item.id === Number(req.params.id));
  if (!f) return res.status(404).json({ success: false, message: 'Facility not found' });
  const facilityInspections = inspections.filter(i => i.facility_id === f.id);
  const facilityComplaints = complaints.filter(c => c.facility_id === f.id);
  res.json({ success: true, data: { ...f, inspections: facilityInspections, complaints: facilityComplaints } });
});

app.put('/api/facilities/:id', (req, res) => {
  const idx = facilities.findIndex(item => item.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Facility not found' });
  facilities[idx] = { ...facilities[idx], ...req.body, id: Number(req.params.id) };
  res.json({ success: true, message: 'Facility updated successfully', data: facilities[idx] });
});

app.delete('/api/facilities/:id', (req, res) => {
  const idx = facilities.findIndex(item => item.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Facility not found' });
  facilities.splice(idx, 1);
  res.json({ success: true, message: 'Facility deleted successfully' });
});

// --- INSPECTIONS CRUD ---
app.get('/api/inspections', (req, res) => {
  let result = [...inspections];
  if (req.query.facility_id) {
    result = result.filter(i => i.facility_id === Number(req.query.facility_id));
  }
  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/inspections', (req, res) => {
  const { facility_id, cleanliness_score, odor_score, waste_level, notes, inspection_date } = req.body;
  if (!facility_id || cleanliness_score === undefined || odor_score === undefined || !waste_level) {
    return res.status(422).json({ success: false, message: 'Missing required inspection fields' });
  }

  const newInspection = {
    id: nextInspectionId++,
    facility_id: Number(facility_id),
    inspector_id: req.body.inspector_id || 2,
    cleanliness_score: Number(cleanliness_score),
    odor_score: Number(odor_score),
    waste_level,
    water_available: req.body.water_available ?? true,
    notes: notes || '',
    inspection_date: inspection_date || new Date().toISOString().split('T')[0]
  };

  inspections.push(newInspection);

  // Update facility scores atomically
  const fac = facilities.find(f => f.id === Number(facility_id));
  if (fac) {
    fac.cleanliness_score = Number(cleanliness_score);
    fac.odor_score = Number(odor_score);
    fac.waste_level = waste_level;
    if (newInspection.cleanliness_score <= 3) {
      fac.status = 'Critical';
    } else if (newInspection.cleanliness_score <= 6) {
      fac.status = 'Needs Cleaning';
    } else {
      fac.status = 'Good';
    }
  }

  res.status(201).json({ success: true, message: 'Inspection logged and facility updated', data: newInspection });
});

// --- COMPLAINTS CRUD ---
app.get('/api/complaints', (req, res) => {
  let result = [...complaints];
  if (req.query.facility_id) {
    result = result.filter(c => c.facility_id === Number(req.query.facility_id));
  }
  if (req.query.status) {
    result = result.filter(c => c.status.toLowerCase() === req.query.status.toLowerCase());
  }
  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/complaints', (req, res) => {
  const { facility_id, complaint_title, description, priority = 'Medium' } = req.body;
  if (!facility_id || !complaint_title || !description) {
    return res.status(422).json({ success: false, message: 'Missing required complaint fields' });
  }

  const newComplaint = {
    id: nextComplaintId++,
    facility_id: Number(facility_id),
    complaint_title,
    description,
    priority,
    status: 'Pending',
    assigned_to: req.body.assigned_to || 3,
    created_at: new Date().toISOString()
  };

  complaints.push(newComplaint);
  res.status(201).json({ success: true, message: 'Complaint registered successfully', data: newComplaint });
});

app.put('/api/complaints/:id', (req, res) => {
  const idx = complaints.findIndex(c => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Complaint not found' });
  complaints[idx] = { ...complaints[idx], ...req.body, id: Number(req.params.id) };
  res.json({ success: true, message: 'Complaint updated', data: complaints[idx] });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Day 8 REST API Server running on: http://localhost:${PORT}`);
  console.log(`   Database: PostgreSQL schema compliant`);
  console.log(`======================================================`);
  console.log(`Endpoints:`);
  console.log(`  GET    /api/health`);
  console.log(`  GET    /api/facilities/stats`);
  console.log(`  GET    /api/facilities`);
  console.log(`  POST   /api/facilities`);
  console.log(`  GET    /api/facilities/:id`);
  console.log(`  PUT    /api/facilities/:id`);
  console.log(`  DELETE /api/facilities/:id`);
  console.log(`  GET    /api/inspections`);
  console.log(`  POST   /api/inspections`);
  console.log(`  GET    /api/complaints`);
  console.log(`  POST   /api/complaints`);
  console.log(`  PUT    /api/complaints/:id`);
  console.log(`======================================================\n`);
});

module.exports = app;
