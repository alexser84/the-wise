const fs = require('fs');
const path = require('path');

const resourceName = process.argv[2];

if (!resourceName) {
    console.error('Por favor, proporciona un nombre para el recurso.');
    process.exit(1);
}

const capitalizedResourceName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
const controllerContent = `
const ${resourceName}Model = require('../models/${resourceName}Model');

exports.get${capitalizedResourceName} = (req, res) => {
    res.render('${resourceName}', { title: ${resourceName}Model.title, description: ${resourceName}Model.description });
};

// Agrega más métodos según sea necesario
`;

const modelContent = `
const ${resourceName}Model = {
    // Define tu modelo aquí
};

module.exports = ${resourceName}Model;
`;

const routeContent = `
const express = require('express');
const router = express.Router();
const ${resourceName}Controller = require('../controllers/${resourceName}Controller');

router.get('/', ${resourceName}Controller.get${capitalizedResourceName});

module.exports = router;
`;

// Crear el controlador
fs.writeFileSync(path.join(__dirname, 'controllers', `${resourceName}Controller.js`), controllerContent);
console.log(`Controlador ${resourceName} creado.`);

// Crear el modelo
fs.writeFileSync(path.join(__dirname, 'models', `${resourceName}Model.js`), modelContent);
console.log(`Modelo ${resourceName} creado.`);

// Crear la ruta
fs.writeFileSync(path.join(__dirname, 'routes', `${resourceName}Routes.js`), routeContent);
console.log(`Ruta ${resourceName} creada.`);

// Actualizar el archivo de rutas principal
const mainRouteFilePath = path.join(__dirname, 'routes', 'index.js');
let mainRouteFileContent = fs.readFileSync(mainRouteFilePath, 'utf8');

const importStatement = `const ${resourceName}Routes = require('./${resourceName}Routes');\n`;
const useStatement = `router.use('/${resourceName}', ${resourceName}Routes);\n`;

// Insertar las declaraciones de importación y uso
if (!mainRouteFileContent.includes(importStatement)) {
    const lastImportIndex = mainRouteFileContent.lastIndexOf('const');
    mainRouteFileContent = mainRouteFileContent.slice(0, lastImportIndex) + importStatement + mainRouteFileContent.slice(lastImportIndex);
}

if (!mainRouteFileContent.includes(useStatement)) {
    const lastUseIndex = mainRouteFileContent.lastIndexOf('router.use');
    mainRouteFileContent = mainRouteFileContent.slice(0, lastUseIndex + 11) + useStatement + mainRouteFileContent.slice(lastUseIndex + 11);
}

fs.writeFileSync(mainRouteFilePath, mainRouteFileContent);
console.log(`Archivo de rutas principal actualizado con ${resourceName}.`);
