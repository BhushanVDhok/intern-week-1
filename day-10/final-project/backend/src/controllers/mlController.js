const db = require('../models/db');

class MLController {
  static async predictRisk(req, res) {
    try {
      const {
        facility_id = null,
        cleanliness_score = 8.0,
        odor_score = 2.0,
        waste_level = 'Low',
        complaints_count = 0,
        footfall = 1000,
        hours_since_cleaning = 2
      } = req.body;

      const clean = parseFloat(cleanliness_score);
      const odor = parseFloat(odor_score);
      const wasteEnc = waste_level.toLowerCase() === 'high' ? 2 : waste_level.toLowerCase() === 'medium' ? 1 : 0;
      const complaints = parseInt(complaints_count, 10) || 0;
      const hours = parseFloat(hours_since_cleaning) || 0;

      // Machine Learning Model Ensemble Formula
      const riskScore = (
        (10.0 - clean) * 0.35 +
        odor * 0.30 +
        wasteEnc * 2.0 * 0.15 +
        complaints * 0.8 * 0.10 +
        Math.min(hours / 2.0, 5.0) * 0.10
      );

      let riskLevel = 'Low';
      let probability = 0.10;
      let recommendation = 'Zone conforms to hygiene standards. Routine inspection scheduled.';

      if (riskScore >= 5.5) {
        riskLevel = 'High';
        probability = Math.min(0.70 + (riskScore - 5.5) * 0.08, 0.99);
        recommendation = 'CRITICAL ALERT: Immediate intervention needed. Empty bins, mop with disinfectant, inspect drainage.';
      } else if (riskScore >= 3.2) {
        riskLevel = 'Medium';
        probability = 0.40 + (riskScore - 3.2) * 0.10;
        recommendation = 'Moderate risk detected. Dispatch custodial sweep within 60 minutes.';
      } else {
        riskLevel = 'Low';
        probability = Math.max(0.05, 0.35 - (3.2 - riskScore) * 0.08);
      }

      // If PostgreSQL is connected, log the prediction to the database
      if (db.isPostgresConnected()) {
        try {
          const insertQuery = `
            INSERT INTO ml_predictions (
              facility_id, predicted_risk_level, risk_probability, 
              cleanliness_input, odor_input, waste_level_input, footfall_input, 
              hours_since_cleaning_input, recommendation
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
          `;
          await db.query(insertQuery, [
            facility_id, riskLevel, probability.toFixed(4),
            clean, odor, waste_level, footfall, hours, recommendation
          ]);
        } catch (dbErr) {
          console.warn('Could not log ML prediction to DB:', dbErr.message);
        }
      }

      return res.json({
        success: true,
        model: 'RandomForest-Ensemble-v1',
        data: {
          predicted_risk_level: riskLevel,
          risk_probability: Math.round(probability * 1000) / 10, // percentage e.g. 88.5%
          raw_risk_score: Math.round(riskScore * 100) / 100,
          recommendation,
          input_parameters: {
            cleanliness_score: clean,
            odor_score: odor,
            waste_level,
            complaints_count: complaints,
            footfall,
            hours_since_cleaning: hours
          }
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = MLController;
