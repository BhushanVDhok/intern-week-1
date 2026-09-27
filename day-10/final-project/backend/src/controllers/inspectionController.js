const db = require('../models/db');
const FacilityController = require('./facilityController');

let fallbackInspections = [
  { id: 1, facility_id: 1, cleanliness_score: 9, odor_score: 2, waste_level: 'Low', water_available: true, notes: 'Floors dry and spotless.', inspection_date: '2026-09-24' },
  { id: 2, facility_id: 1, cleanliness_score: 8, odor_score: 2, waste_level: 'Low', water_available: true, notes: 'Regular shift audit.', inspection_date: '2026-09-26' },
  { id: 3, facility_id: 2, cleanliness_score: 4, odor_score: 7, waste_level: 'High', water_available: true, notes: 'Trash can overflowing.', inspection_date: '2026-09-25' },
  { id: 4, facility_id: 5, cleanliness_score: 3, odor_score: 9, waste_level: 'High', water_available: false, notes: 'Drainage backup detected.', inspection_date: '2026-09-26' }
];
let nextInspectionId = 5;

class InspectionController {
  static async getAll(req, res) {
    try {
      if (db.isPostgresConnected()) {
        let query = 'SELECT i.*, f.name AS facility_name FROM inspections i JOIN facilities f ON i.facility_id = f.id';
        const params = [];
        if (req.query.facility_id) {
          query += ' WHERE i.facility_id = $1';
          params.push(req.query.facility_id);
        }
        query += ' ORDER BY i.inspection_date DESC';
        const result = await db.query(query, params);
        return res.json({ success: true, count: result.rows.length, data: result.rows });
      }

      let list = [...fallbackInspections];
      if (req.query.facility_id) {
        list = list.filter(i => i.facility_id === Number(req.query.facility_id));
      }
      return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    const { facility_id, cleanliness_score, odor_score, waste_level, notes, water_available = true } = req.body;
    if (!facility_id || cleanliness_score === undefined || odor_score === undefined || !waste_level) {
      return res.status(422).json({ success: false, message: 'Missing required audit parameters' });
    }

    const clean = Number(cleanliness_score);
    const odor = Number(odor_score);
    let newStatus = 'Good';
    if (clean <= 3.5 || odor >= 8.0) newStatus = 'Critical';
    else if (clean <= 6.5 || odor >= 5.0) newStatus = 'Needs Cleaning';

    try {
      if (db.isPostgresConnected()) {
        const client = await db.pool.connect();
        try {
          await client.query('BEGIN');
          const insQuery = `
            INSERT INTO inspections (facility_id, cleanliness_score, odor_score, waste_level, water_available, notes, inspection_date)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
            RETURNING *;
          `;
          const insRes = await client.query(insQuery, [facility_id, clean, odor, waste_level, water_available, notes || '']);

          await client.query(`
            UPDATE facilities 
            SET cleanliness_score = $1, odor_score = $2, waste_level = $3, status = $4, hours_since_cleaning = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5;
          `, [clean, odor, waste_level, newStatus, facility_id]);

          await client.query('COMMIT');
          return res.status(201).json({ success: true, message: 'Inspection logged & facility scores updated', data: insRes.rows[0] });
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      }

      // Fallback
      const newIns = {
        id: nextInspectionId++,
        facility_id: Number(facility_id),
        cleanliness_score: clean,
        odor_score: odor,
        waste_level,
        water_available,
        notes: notes || '',
        inspection_date: new Date().toISOString().split('T')[0]
      };
      fallbackInspections.unshift(newIns);

      // Update parent facility in fallback store
      const facs = FacilityController.getFallbackFacilities();
      const fac = facs.find(f => f.id === Number(facility_id));
      if (fac) {
        fac.cleanliness_score = clean;
        fac.odor_score = odor;
        fac.waste_level = waste_level;
        fac.status = newStatus;
        fac.hours_since_cleaning = 0;
      }

      return res.status(201).json({ success: true, message: 'Inspection logged', data: newIns });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = InspectionController;
