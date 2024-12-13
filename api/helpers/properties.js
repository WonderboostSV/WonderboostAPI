// Cargar las variables de entorno desde un archivo .env
require('dotenv').config();

const properties = {
    DB_SERVER,
    DB_SERVER,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DIALECT,
    TZ,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM_NAME,
    EMAIL_FROM_ADDRESS,
    CLAVE_JWT,
    CLAVE_SESION,
    NODE_ENV,
    PORT,
} = process.env;

module.exports = properties;