require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes/index');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Middleware para manejar layouts
app.use(expressLayouts);
app.set('layout', 'layouts/layout');  // Establece la ruta de tu layout principal
app.use(routes);

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
