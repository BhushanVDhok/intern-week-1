const db = require('../models/db');

let fallbackComplaints = [
  { id: 1, facility_id: 2, complaint_title: 'Trash bin overflowing', description: 'Spilling on floor near sink.', priority: 'High', status: 'Pending', created_at: '2026-09-25T10:00:00Z' },
  { id: 2, facility_id: 2, complaint_title: 'Hand dryer not functioning', description: 'Not blowing warm air.', priority: 'Medium', status: 'In Progress', created_at: '2026-09-26T08:30:00Z' },
  { id: 3, facility_id: 5, complaint_title: 'Strong sewer odor near entrance', description: 'Pungent odor noticeable.', priority: 'Urgent', status: 'Pending', created_at: '2026-09-26T11:00:00Z' }
];
let nextComplaintId = 4;

class ComplaintController {
  static async getAll(req, res) {
    try {
      if (db.isPostgresConnected()) {
        let query = 'SELECT c.*, f.name AS facility_name FROM complaints c JOIN facilities f ON c.facility_id = f.id';
        const params = [];
        if (req.query.facility_id) {
          query += ' WHERE c.facility_id = $1';
          params.push(req.query.facility_id);
        }
        query += ' ORDER BY c.created_at DESC';
        const result = await db.query(query, params);
        return res.json({ success: true, count: result.rows.length, data: result.rows });
      }

      let list = [...fallbackComplaints];
      if (req.query.facility_id) {
        list = list.filter(c => c.facility_id === Number(req.query.facility_id));
      }
      return res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req, res) {
    const { facility_id, complaint_title, description, priority = 'Medium' } = req.body;
    if (!facility_id || !complaint_title || !description) {
      return res.status(422).json({ success: false, message: 'Missing required complaint parameters' });
    }

    try {
      if (db.isPostgresConnected()) {
        const query = `
          INSERT INTO complaints (facility_id, complaint_title, description, priority, status)
          VALUES ($1, $2, $3, $4, 'Pending')
          RETURNING *;
        `;
        const result = await db.query(query, [facility_id, complaint_title, description, priority]);
        return res.status(201).json({ success: true, message: 'Complaint registered', data: result.rows[0] });
      }

      const newC = {
        id: nextComplaintId++,
        facility_id: Number(facility_id),
        complaint_title,
        description,
        priority,
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      fallbackComplaints.unshift(newC);
      return res.status(201).json({ success: true, message: 'Complaint registered', data: newC });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateStatus(req, res) {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(422).json({ success: false, message: 'Status is required' });

    try {
      if (db.isPostgresConnected()) {
        const query = 'UPDATE complaints SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;';
        const result = await db.query(query, [status, id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Complaint not found' });
        return res.json({ success: true, message: 'Status updated', data: result.rows[0] });
      }

      const c = fallbackComplaints.find(item => item.id === id);
      if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' });
      c.status = status;
      return res.json({ success: true, message: 'Status updated', data: c });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ComplaintController;
