
const auditoriasModel = require('../models/auditoriasModel');

exports.getAuditorias = (req, res) => {
    res.render('auditorias', { title: auditoriasModel.title, description: auditoriasModel.description });
};

// Agrega más métodos según sea necesario
