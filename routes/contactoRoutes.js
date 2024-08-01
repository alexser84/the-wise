const express = require('express');
const nodemailer = require('nodemailer');
const { body, check, validationResult } = require('express-validator');

const router = express.Router();

// Configuración del transporter de nodemailer (ajusta según tu proveedor de correo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware de validación y sanitización
const validateAndSanitizeInput = [
  check('name')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Email inválido')
    .isLength({ max: 255 }).withMessage('El email no puede exceder 255 caracteres'),
  check('message')
    .trim()
    .escape()
    .notEmpty().withMessage('El mensaje es requerido')
    .isLength({ max: 1000 }).withMessage('El mensaje no puede exceder 1000 caracteres')
];

// Función para procesar el formulario de contacto
const processContactForm = async (req, res) => {
  // Verifica si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message } = req.body;

  try {
    // Configura el correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER_CONTACT,
      subject: 'Nuevo mensaje de formulario de contacto',
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong> ${message}</p>`
    };

    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);

    // Responde al cliente
    res.status(200).json({ message: 'Formulario enviado con éxito' });
  } catch (error) {
    console.error('Error al procesar el formulario de contacto:', error);
    res.status(500).json({ message: 'Error al procesar el formulario' });
  }
};

// Ruta para manejar el envío del formulario
router.post('/contacto', validateAndSanitizeInput, processContactForm);

module.exports = router;