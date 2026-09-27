const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// In-memory data store mirroring PostgreSQL database
let facilities = [
  { id: 1, name: 'Terminal 1 Restrooms', location: 'Building A - Concourse 1', capacity: 120, status: 'Good', cleanliness_score: 8.5, odor_score: 2.0, waste_level: 'Low', footfall: 1250 },
  { id: 2, name: 'Food Court Washrooms', location: 'Building B - Level 2', capacity: 200, status: 'Needs Cleaning', cleanliness_score: 4.2, odor_score: 7.5, waste_level: 'High', footfall: 3400 },
  { id: 3, name: 'Central Atrium Restrooms', location: 'Main Hub - Floor 1', capacity: 150, status: 'Under Maintenance', cleanliness_score: 6.0, odor_score: 4.0, waste_level: 'Medium', footfall: 1800 },
  { id: 4, name: 'East Wing Restrooms', location: 'Building C - Floor 3', capacity: 80, status: 'Good', cleanliness_score: 9.0, odor_score: 1.5, waste_level: 'Low', footfall: 620 },
  { id: 5, name: 'Cargo Bay Washrooms', location: 'Hangar 4 - Ground', capacity: 50, status: 'Critical', cleanliness_score: 3.1, odor_score: 8.8, waste_level: 'High', footfall: 450 }
];

let inspections = [
  { id: 1, facility_id: 1, cleanliness_score: 9, odor_score: 2, waste_level: 'Low', water_available: true, notes: 'Dispensers filled and clean floors.', inspection_date: '2026-09-20' },
  { id: 2, facility_id: 1, cleanliness_score: 8, odor_score: 3, waste_level: 'Low', water_available: true, notes: 'Morning inspection.', inspection_date: '2026-09-24' },
  { id: 3, facility_id: 2, cleanliness_score: 4, odor_score: 7, waste_level: 'High', water_available: true, notes: 'Heavy trash overflow.', inspection_date: '2026-09-22' },
  { id: 4, facility_id: 2, cleanliness_score: 3, odor_score: 8, waste_level: 'High', water_available: false, notes: 'Water sensor offline.', inspection_date: '2026-09-25' },
  { id: 5, facility_id: 5, cleanliness_score: 3, odor_score: 9, waste_level: 'High', water_available: false, notes: 'Drainage backup detected.', inspection_date: '2026-09-25' }
];

let complaints = [
  { id: 1, facility_id: 2, complaint_title: 'Trash overflow', description: 'Bin overflowing near entrance.', priority: 'High', status: 'Pending' },
  { id: 2, facility_id: 5, complaint_title: 'Strong sewer odor', description: 'Drain odor in corridor.', priority: 'Urgent', status: 'Pending' },
  { id: 3, facility_id: 1, complaint_title: 'Empty soap dispenser', description: 'Stall 2 dispenser empty.', priority: 'Low', status: 'Resolved' }
];

let nextFacilityId = 6;
let nextInspectionId = 6;
let nextComplaintId = 4;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'PostgreSQL-Mock', timestamp: new Date().toISOString() });
});

app.get('/api/facilities/stats', (req, res) => {
  const total = facilities.length;
  const avg = (facilities.reduce((acc, f) => acc + f.cleanliness_score, 0) / total).toFixed(1);
  res.json({
    success: true,
    data: {
      total_facilities: total,
      average_cleanliness: parseFloat(avg),
      critical_facilities: facilities.filter(f => f.status === 'Critical').length,
      needs_cleaning: facilities.filter(f => f.status === 'Needs Cleaning').length,
      pending_complaints: complaints.filter(c => c.status === 'Pending').length,
      total_inspections: inspections.length
    }
  });
});

app.get('/api/facilities', (req, res) => {
  res.json({ success: true, count: facilities.length, data: facilities });
});

app.post('/api/facilities', (req, res) => {
  const newF = {
    id: nextFacilityId++,
    name: req.body.name,
    location: req.body.location,
    capacity: Number(req.body.capacity) || 100,
    status: req.body.status || 'Good',
    cleanliness_score: 8.0,
    odor_score: 2.0,
    waste_level: 'Low',
    footfall: 0
  };
  facilities.push(newF);
  res.status(201).json({ success: true, data: newF });
});

app.get('/api/inspections', (req, res) => {
  let list = [...inspections];
  if (req.query.facility_id) {
    list = list.filter(i => i.facility_id === Number(req.query.facility_id));
  }
  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/inspections', (req, res) => {
  const newI = {
    id: nextInspectionId++,
    facility_id: Number(req.body.facility_id),
    cleanliness_score: Number(req.body.cleanliness_score),
    odor_score: Number(req.body.odor_score),
    waste_level: req.body.waste_level,
    water_available: req.body.water_available ?? true,
    notes: req.body.notes || '',
    inspection_date: req.body.inspection_date || new Date().toISOString().split('T')[0]
  };
  inspections.unshift(newI);

  // Auto-update facility scores
  const f = facilities.find(item => item.id === newI.facility_id);
  if (f) {
    f.cleanliness_score = newI.cleanliness_score;
    f.odor_score = newI.odor_score;
    f.waste_level = newI.waste_level;
    if (f.cleanliness_score <= 3) f.status = 'Critical';
    else if (f.cleanliness_score <= 6) f.status = 'Needs Cleaning';
    else f.status = 'Good';
  }

  res.status(201).json({ success: true, data: newI });
});

app.get('/api/complaints', (req, res) => {
  let list = [...complaints];
  if (req.query.facility_id) {
    list = list.filter(c => c.facility_id === Number(req.query.facility_id));
  }
  res.json({ success: true, count: list.length, data: list });
});

app.post('/api/complaints', (req, res) => {
  const newC = {
    id: nextComplaintId++,
    facility_id: Number(req.body.facility_id),
    complaint_title: req.body.complaint_title,
    description: req.body.description,
    priority: req.body.priority || 'Medium',
    status: 'Pending',
    created_at: new Date().toISOString()
  };
  complaints.unshift(newC);
  res.status(201).json({ success: true, data: newC });
});

app.put('/api/complaints/:id', (req, res) => {
  const c = complaints.find(item => item.id === Number(req.params.id));
  if (c && req.body.status) {
    c.status = req.body.status;
  }
  res.json({ success: true, data: c });
});

app.listen(PORT, () => {
  console.log(`✓ Day 9 API Integration Server running on http://localhost:${PORT}`);
});
