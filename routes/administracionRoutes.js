
const express = require('express');
const router = express.Router();
const administracionController = require('../controllers/administracionController');

router.get('/', administracionController.getAdministracion);

module.exports = router;
