
const express = require('express');
const router = express.Router();
const corretajeController = require('../controllers/corretajeController');

router.get('/', corretajeController.getCorretaje);

module.exports = router;
