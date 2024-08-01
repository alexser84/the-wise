require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 80;
const routes = require('./routes/index');
const contactFormRouter = require('./routes/contactoRoutes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Middleware para manejar layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');  // Establece la ruta de tu layout principal
app.use(routes);
app.use('/api', contactFormRouter);

app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    console.log('Request Query:', req.query);
    console.log('Content-Type:', req.get('Content-Type'));
    next();
  });
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
