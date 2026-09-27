const express = require('express');
const router = express.Router();
const ComplaintController = require('../controllers/complaintController');

router.get('/', ComplaintController.getAll);
router.post('/', ComplaintController.create);
router.put('/:id', ComplaintController.updateStatus);

module.exports = router;
