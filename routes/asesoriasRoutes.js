
const express = require('express');
const router = express.Router();
const asesoriasController = require('../controllers/asesoriasController');

router.get('/', asesoriasController.getAsesorias);

module.exports = router;
