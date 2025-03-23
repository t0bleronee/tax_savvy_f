const express = require('express');
const { saveTaxData, getTaxData, updateTaxData } = require('../controllers/taxController');

const router = express.Router();

// Define routes
router.post('/save', saveTaxData);
router.get('/:email', getTaxData);
router.put('/:id', updateTaxData);

// Export router
module.exports = router;
