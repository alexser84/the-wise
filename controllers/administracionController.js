
const administracionModel = require('../models/administracionModel');

exports.getAdministracion = (req, res) => {
    res.render('administracion', { title: administracionModel.title, description: administracionModel.description });
};

// Agrega más métodos según sea necesario
