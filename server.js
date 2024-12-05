require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer(); // Configuración básica sin almacenamiento de archivos
const cors = require('cors');

const app = express();

app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(upload.none()); // Solo procesa datos de texto
app.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Reemplaza con el origen permitido
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });  

  // Configura CORS para permitir solicitudes desde localhost:5173
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

// Función para registrar automáticamente rutas desde `services`
const registerRoutes = (basePath) => {
    const servicesPath = path.join(__dirname, basePath);

    fs.readdirSync(servicesPath).forEach((folder) => {
        const folderPath = path.join(servicesPath, folder);
        if (fs.lstatSync(folderPath).isDirectory()) {
            fs.readdirSync(folderPath).forEach((file) => {
                if (file.endsWith('.js')) {
                    const { router, secondRouter } = require(path.join(folderPath, file));

                    // Registrar rutas protegidas (requieren JWT)
                    const protectedPath = `/${folder}/${file.replace('.js', '')}`;
                    if (router) {
                        app.use(protectedPath, router);
                        console.log(`Ruta protegida registrada: ${protectedPath}`);
                    }

                    // Registrar rutas públicas (no requieren JWT)
                    const publicPath = `/public/${folder}/${file.replace('.js', '')}`;
                    if (secondRouter) {
                        app.use(publicPath, secondRouter);
                        console.log(`Ruta pública registrada: ${publicPath}`);
                    }
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
