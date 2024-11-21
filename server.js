require('dotenv').config();
const express = require('express');
const { setupSession } = require('./api/helpers/session'); // Importar configuración de sesión
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de sesión (reutilizada desde session.js)
setupSession(app);

// Función para registrar automáticamente rutas desde `services`
const registerRoutes = (basePath) => {
    const servicesPath = path.join(__dirname, basePath);
    fs.readdirSync(servicesPath).forEach((folder) => {
        const folderPath = path.join(servicesPath, folder);
        if (fs.lstatSync(folderPath).isDirectory()) {
            fs.readdirSync(folderPath).forEach((file) => {
                if (file.endsWith('.js')) {
                    const routePath = `/${folder}/${file.replace('.js', '')}`;
                    const router = require(path.join(folderPath, file));
                    app.use(routePath, router);
                    console.log(`Ruta registrada: ${routePath}`);
                }
            });
        }
    });
};

// Registrar rutas desde `api/services`
registerRoutes('api/services');

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
