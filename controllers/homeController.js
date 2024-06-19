// controllers/homeController.js
const homeModel = require('../models/homeModel');

exports.getHomePage = (req, res) => {
    res.render('index', { title: homeModel.title, description: homeModel.description });
};