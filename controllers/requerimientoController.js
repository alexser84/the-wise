
const requerimientoModel = require('../models/requerimientoModel.js');

exports.getRequerimiento = (req, res) => {
    res.render('requerimiento', { title: requerimientoModel.title, description: requerimientoModel.description });
};

