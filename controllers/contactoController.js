
const corretajeModel = require('../models/corretajeModel');

exports.getCorretaje = (req, res) => {
    res.render('corretaje', { title: corretajeModel.title, description: corretajeModel.description });
};

// Agrega más métodos según sea necesario
