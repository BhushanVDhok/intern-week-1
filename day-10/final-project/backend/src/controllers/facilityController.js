const db = require('../models/db');

// Fallback in-memory dataset
let fallbackFacilities = [
  { id: 1, name: 'Terminal 1 Main Restrooms', location: 'Terminal 1 - Central Concourse', capacity: 150, status: 'Good', cleanliness_score: 8.8, odor_score: 1.8, waste_level: 'Low', footfall: 1850, hours_since_cleaning: 1 },
  { id: 2, name: 'Terminal 1 Food Court Washrooms', location: 'Terminal 1 - Food Plaza Level 2', capacity: 220, status: 'Needs Cleaning', cleanliness_score: 4.5, odor_score: 7.2, waste_level: 'High', footfall: 4200, hours_since_cleaning: 5 },
  { id: 3, name: 'Transit Lounge Washrooms', location: 'Terminal 2 - Gate B4', capacity: 100, status: 'Good', cleanliness_score: 9.2, odor_score: 1.2, waste_level: 'Low', footfall: 780, hours_since_cleaning: 2 },
  { id: 4, name: 'Ground Transport Restrooms', location: 'Basement Level - Bus Hub', capacity: 80, status: 'Under Maintenance', cleanliness_score: 5.8, odor_score: 4.5, waste_level: 'Medium', footfall: 1950, hours_since_cleaning: 4 },
  { id: 5, name: 'Cargo & Baggage Bay Washrooms', location: 'Hangar 3 - Ground Level', capacity: 60, status: 'Critical', cleanliness_score: 3.2, odor_score: 8.9, waste_level: 'High', footfall: 610, hours_since_cleaning: 8 },
  { id: 6, name: 'Executive Lounge Restrooms', location: 'Terminal 1 - Mezzanine Level', capacity: 50, status: 'Good', cleanliness_score: 9.6, odor_score: 1.0, waste_level: 'Low', footfall: 320, hours_since_cleaning: 1 }
];
let nextFacilityId = 7;

class FacilityController {
  static async getAll(req, res) {
    try {
      if (db.isPostgresConnected()) {
        const query = `
          SELECT f.*, 
            COUNT(DISTINCT i.id)::int AS inspections_count, 
            COUNT(DISTINCT c.id) FILTER (WHERE c.status != 'Resolved')::int AS active_complaints_count
          FROM facilities f
          LEFT JOIN inspections i ON f.id = i.facility_id
          LEFT JOIN complaints c ON f.id = c.facility_id
          GROUP BY f.id
          ORDER BY f.id ASC;
        `;
        const result = await db.query(query);
        return res.json({ success: true, count: result.rows.length, data: result.rows, source: 'PostgreSQL' });
      }

      // Memory fallback
      return res.json({ success: true, count: fallbackFacilities.length, data: fallbackFacilities, source: 'Memory' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req, res) {
    const id = Number(req.params.id);
    try {
      if (db.isPostgresConnected()) {
        const fRes = await db.query('SELECT * FROM facilities WHERE id = $1', [id]);
        if (fRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Facility not found' });
        const iRes = await db.query('SELECT * FROM inspections WHERE facility_id = $1 ORDER BY inspection_date DESC', [id]);
        const cRes = await db.query('SELECT * FROM complaints WHERE facility_id = $1 ORDER BY created_at DESC', [id]);

        return res.json({
          success: true,
          data: {
            ...fRes.rows[0],
            inspections: iRes.rows,
            complaints: cRes.rows
          }
        });
      }

      const fac = fallbackFacilities.find(f => f.id === id);
      if (!fac) return res.status(404).json({ success: false, message: 'Facility not found' });
      return res.json({ success: true, data: fac });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    const { name, location, capacity = 100, status = 'Good' } = req.body;
    if (!name || !location) {
      return res.status(422).json({ success: false, message: 'Name and location are required' });
    }

    try {
      if (db.isPostgresConnected()) {
        const insertQuery = `
          INSERT INTO facilities (name, location, capacity, status, cleanliness_score, odor_score, waste_level, footfall, hours_since_cleaning)
          VALUES ($1, $2, $3, $4, 8.0, 2.0, 'Low', 0, 0)
          RETURNING *;
        `;
        const result = await db.query(insertQuery, [name, location, capacity, status]);
        return res.status(201).json({ success: true, message: 'Facility created', data: result.rows[0] });
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
        footfall: 0,
        hours_since_cleaning: 0
      };
      fallbackFacilities.push(newFacility);
      return res.status(201).json({ success: true, message: 'Facility created', data: newFacility });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getStats(req, res) {
    try {
      if (db.isPostgresConnected()) {
        const statsQuery = `
          SELECT 
            COUNT(*)::int AS total_facilities,
            COALESCE(ROUND(AVG(cleanliness_score), 1), 0.0)::float AS average_cleanliness,
            COUNT(*) FILTER (WHERE status = 'Critical')::int AS critical_facilities,
            COUNT(*) FILTER (WHERE status = 'Needs Cleaning')::int AS needs_cleaning
          FROM facilities;
        `;
        const result = await db.query(statsQuery);
        return res.json({ success: true, data: result.rows[0] });
      }

      const total = fallbackFacilities.length;
      const avg = total > 0 ? (fallbackFacilities.reduce((sum, f) => sum + f.cleanliness_score, 0) / total).toFixed(1) : 0;
      return res.json({
        success: true,
        data: {
          total_facilities: total,
          average_cleanliness: parseFloat(avg),
          critical_facilities: fallbackFacilities.filter(f => f.status === 'Critical').length,
          needs_cleaning: fallbackFacilities.filter(f => f.status === 'Needs Cleaning').length
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static getFallbackFacilities() {
    return fallbackFacilities;
  }
}

module.exports = FacilityController;
