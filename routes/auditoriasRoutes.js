
const express = require('express');
const router = express.Router();
const auditoriasController = require('../controllers/auditoriasController');

router.get('/', auditoriasController.getAuditorias);

module.exports = router;
