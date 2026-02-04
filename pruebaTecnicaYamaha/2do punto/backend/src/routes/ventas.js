const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { processSalesFile, createSale } = require('../controllers/ventasController');
const { validateSale } = require('../middleware/validation');

// Single sale endpoint
router.post('/', validateSale, createSale);

// Batch file upload endpoint
router.post('/batch', upload.single('file'), processSalesFile);

module.exports = router;
