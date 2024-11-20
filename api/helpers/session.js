// Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
require('dotenv').config();
// session.js
const session = require('express-session');

// Configuración de la sesión
const sessionConfig = {
  secret: process.env.CLAVE_SESION, // Cambia esto por algo seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }, // Solo en producción
};

const setupSession = (app) => {
  app.use(session(sessionConfig));
};

module.exports = { setupSession };
