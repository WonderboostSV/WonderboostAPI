// Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
require('dotenv').config();
// jwt.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.CLAVE_JWT; // Cambia esto por algo seguro

// Función para generar un JWT
const generateJWT = (userId) => {
  const payload = { userId };
  const options = { expiresIn: '1h' }; // Tiempo de expiración del token
  return jwt.sign(payload, secretKey, options);
};

// Función para verificar un JWT
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null; // Si no es válido
  }
};

module.exports = { generateJWT, verifyJWT };
