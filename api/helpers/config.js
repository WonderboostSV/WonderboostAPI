// Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
require('dotenv').config();
const path = require('path');

// Verifica si el archivo .env existe
const fs = require('fs');
const envPath = path.join('', '.env');

if (!fs.existsSync(envPath)) {
    throw new Error(`El archivo .env no existe en la ruta ${envPath}`);
}

// Configurar la zona horaria local
process.env.TZ = 'America/El_Salvador';

// Definir las variables de conexión a la base de datos usando las variables de entorno cargadas
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT// Agrega el dialecto de la base de datos
};

// Encabezado para permitir solicitudes de cualquier origen (si se implementa un servidor HTTP más adelante)
const setHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
};

module.exports = { config, setHeaders };
