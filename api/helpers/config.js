// Cargar variables de entorno desde un archivo .env
const properties = require('./properties');
const path = require('path');

// Verifica si el archivo .env existe
const fs = require('fs');
const envPath = path.join('', '.env');

if (!fs.existsSync(envPath)) {
    throw new Error(`El archivo .env no existe en la ruta ${envPath}`);
}

// Definir las variables de conexión a la base de datos usando las variables de entorno cargadas
const config = {
    server: properties.DB_SERVER,
    database: properties.DB_DATABASE,
    username: properties.DB_USERNAME,
    password: properties.DB_PASSWORD,
    dialect: properties.DB_DIALECT
};

// Encabezado para permitir solicitudes de cualquier origen (si se implementa un servidor HTTP más adelante)
const setHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
};

module.exports = { config, setHeaders };
