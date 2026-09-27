const express = require('express');
const router = express.Router();
const InspectionController = require('../controllers/inspectionController');

router.get('/', InspectionController.getAll);
router.post('/', InspectionController.create);

module.exports = router;
