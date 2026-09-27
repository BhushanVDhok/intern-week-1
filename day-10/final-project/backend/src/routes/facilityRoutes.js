const express = require('express');
const router = express.Router();
const FacilityController = require('../controllers/facilityController');

router.get('/stats', FacilityController.getStats);
router.get('/', FacilityController.getAll);
router.get('/:id', FacilityController.getById);
router.post('/', FacilityController.create);

module.exports = router;
