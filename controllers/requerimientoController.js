
const requerimientoModel = require('../models/requerimientoModel');

exports.getRequerimiento = (req, res) => {
    res.render('requerimiento', { title: requerimientoModel.title, description: requerimientoModel.description });
};


exports.setRequerimiento = (req, res) => {
    res.render('requerimiento', { title: requerimientoModel.title, description: requerimientoModel.description });
};