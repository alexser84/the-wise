
const asesoriasModel = require('../models/asesoriasModel');

exports.getAsesorias = (req, res) => {
    res.render('asesorias', { title: asesoriasModel.title, description: asesoriasModel.description });
};

// Agrega más métodos según sea necesario
