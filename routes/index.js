// routes/index.js
const express = require('express');
const router = express.Router();

const homeRoutes = require('./homeRoutes');
// Aquí puedes importar más archivos de rutas según crezcas
const asesoriasRoutes = require('./asesoriasRoutes');
const corretajeRoutes = require('./corretajeRoutes');
const auditoriasRoutes = require('./auditoriasRoutes');
const administracionRoutes = require('./administracionRoutes');

router.use('/', homeRoutes);
router.use('/administracion', administracionRoutes);
router.use('/auditorias', auditoriasRoutes);
router.use('/corretaje', corretajeRoutes);
router.use('/asesorias', asesoriasRoutes);

module.exports = router;
