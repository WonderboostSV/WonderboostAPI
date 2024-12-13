// Cargar variables de entorno desde un archivo .env
const properties = require('./properties');
const jwt = require('jsonwebtoken');

const secretKey = properties.CLAVE_JWT;

// Función para generar un JWT
const generateJWT = (userData) => {
  const options = { expiresIn: '1h' };
  return jwt.sign(userData, secretKey, options);
};

// Middleware para verificar un JWT en las solicitudes de Express
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']; // Leer el token del encabezado
  if (!token) {
    return res.status(403).json({ status: 0, message: 'Token no proporcionado', dataset: null, error: 'El token no fue proporcionado', exception: null });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verificar token
    req.user = decoded; // Agregar el usuario decodificado a la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Función para validar un JWT directamente (opcional)
const validateJWT = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = { generateJWT, verifyJWT, validateJWT };
