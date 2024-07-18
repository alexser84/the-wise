
const express = require('express');
const router = express.Router();
const requerimientoController = require('../controllers/requerimientoController');

router.get('/', requerimientoController.getTicket);

router.post('/', requerimientoController.setTicket);

module.exports = router;
