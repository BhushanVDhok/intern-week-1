const express = require('express');
const router = express.Router();
const MLController = require('../controllers/mlController');

router.post('/predict-risk', MLController.predictRisk);

module.exports = router;
