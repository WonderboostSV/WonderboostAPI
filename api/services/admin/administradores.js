// Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
require('dotenv').config();
const express = require('express');
const router = express.Router();
const AdministradoresData = require('../../models/data/administradores_data');
const Validator = require('../../helpers/validator');
const jwt = require('jsonwebtoken'); // Para verificar el JWT

// Definición de constantes para los nombres de los campos de entrada
const POST_ID = "idAdministrador";
const POST_NOMBRE = "nombreAdministrador";
const POST_CORREO = "correoAdministrador";
const POST_CLAVE = "claveAdministrador";
const POST_TELEFONO = "telefonoAdministrador";
const POST_DUI = "duiAdministrador";
const POST_NACIMIENTO = "nacimientoAdministrador";
const POST_ESTADO = "estadoAdministrador";
const POST_DIRECCION = "direccionAdministrador";
const POST_CLAVE_CONFIRMAR = "confirmarClave";
const POST_BUSCAR = "search";

// Middleware para verificar si la sesión o JWT es válida
const verifySession = (req, res, next) => {
    // Usamos express-session o JWT para verificar la sesión
    if (req.session && req.session.idAdministrador) {
        // Si la sesión es válida, pasamos al siguiente middleware
        next();
    } else {
        // Si no hay sesión, devolvemos un error
        res.status(403).json({ error: 'No has iniciado sesión' });
    }
};

// Middleware para verificar el JWT en las solicitudes
const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token de autenticación no proporcionado' });
    }

    jwt.verify(token, process.env.CLAVE_JWT, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido' });
        }
        // Almacenamos los datos del usuario decodificado en el request
        req.user = decoded;
        next();
    });
};

// Controlador para manejar las acciones de la API
router.get('/', (req, res) => {
    res.json({ message: 'Recurso no disponible' });
});

router.post('/', async (req, res) => {
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const action = req.query.action;
    const Administrador = new AdministradoresData();

    try {
        // Verificamos si la sesión está activa o si el usuario tiene un JWT válido
        if (req.session.idAdministrador || req.user) {
            // Si la sesión está activa o el JWT es válido, permitimos las acciones de manejo interno de sistema

            switch (action) {
                // Buscar
                case 'searchRows':
                    if (!Validator.validateSearch2(req.body[POST_BUSCAR])) {
                        result.error = Validator.getSearchError();
                    } else {
                        result.dataset = await Administrador.searchRows(req.body[POST_BUSCAR]);
                        if (result.dataset && result.dataset.length > 0) {
                            result.status = 1;
                            result.message = `Existen ${result.dataset.length} coincidencias`;
                        } else {
                            result.error = 'No hay coincidencias';
                        }
                    }
                    break;

                // Agregar
                case 'createRow':
                    req.body = Validator.validateForm(req.body);

                    if (
                        !Administrador.setNombre(req.body[POST_NOMBRE]) ||
                        !Administrador.setCorreo(req.body[POST_CORREO]) ||
                        !Administrador.setClave(req.body[POST_CLAVE], req.body[POST_NOMBRE], req.body[POST_NACIMIENTO], req.body[POST_TELEFONO], req.body[POST_CORREO]) ||
                        !Administrador.setTelefono(req.body[POST_TELEFONO]) ||
                        !Administrador.setDUI(req.body[POST_DUI]) ||
                        !Administrador.setDireccion(req.body[POST_DIRECCION]) ||
                        !Administrador.setNacimiento(req.body[POST_NACIMIENTO])
                    ) {
                        result.error = Administrador.getDataError();
                    } else if (req.body[POST_CLAVE] !== req.body[POST_CLAVE_CONFIRMAR]) {
                        result.error = 'Contraseñas diferentes';
                    } else if (await Administrador.createRow()) {
                        result.status = 1;
                        result.message = 'Administrador creado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al crear el Administrador';
                    }
                    break;

                // Actualizar
                case 'updateRow':
                    req.body = Validator.validateForm(req.body);

                    if (
                        !Administrador.setId(req.body[POST_ID]) ||
                        !Administrador.setNombre(req.body[POST_NOMBRE]) ||
                        !Administrador.setCorreo(req.body[POST_CORREO]) ||
                        !Administrador.setTelefono(req.body[POST_TELEFONO]) ||
                        !Administrador.setDUI(req.body[POST_DUI]) ||
                        !Administrador.setDireccion(req.body[POST_DIRECCION]) ||
                        !Administrador.setNacimiento(req.body[POST_NACIMIENTO]) ||
                        !Administrador.setEstado(req.body[POST_ESTADO] ? 1 : 0)
                    ) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.updateRow()) {
                        result.status = 1;
                        result.message = 'Administrador modificado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al modificar el Administrador';
                    }
                    break;

                // Ver todos
                case 'readAll':
                    result.dataset = await Administrador.readAll();
                    if (result.dataset && result.dataset.length > 0) {
                        result.status = 1;
                        result.message = `Existen ${result.dataset.length} registros`;
                    } else {
                        result.error = 'No existen Administradors registrados';
                    }
                    break;

                // Ver uno
                case 'readOne':
                    if (!Administrador.setId(req.body[POST_ID])) {
                        result.error = 'Administrador incorrecto';
                    } else {
                        result.dataset = await Administrador.readOne();
                        if (result.dataset) {
                            result.status = 1;
                        } else {
                            result.error = 'Administrador inexistente';
                        }
                    }
                    break;

                // Eliminar
                case 'deleteRow':
                    if (!Administrador.setId(req.body[POST_ID])) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.deleteRow()) {
                        result.status = 1;
                        result.message = 'Administrador eliminado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al eliminar el Administrador';
                    }
                    break;

                // Cambiar estado
                case 'changeState':
                    if (!Administrador.setId(req.body[POST_ID])) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.changeState()) {
                        result.status = 1;
                        result.message = 'Estado del Administrador cambiado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al alterar el estado del Administrador';
                    }
                    break;

                // Acción no disponible
                default:
                    result.error = 'Acción no disponible dentro de la sesión';
            }
        } else {
            // Si no hay sesión activa, permitimos acciones como login, recuperación de contraseña, 2FA, etc.

            switch (action) {
                // Iniciar sesión
                case 'logIn':
                    req.body = Validator.validateForm(req.body);
                    // Llamamos al método checkUser del handler
                    const user = await Administrador.checkUser(req.body[POST_CORREO], req.body[POST_CLAVE], req);
                    // Si el usuario fue encontrado y la autenticación es exitosa
                    if (user) {
                        if (Administrador.getCondicion() === 'temporizador') {
                            result.error = 'Intento iniciar sesión varias veces y su tiempo de bloqueo aun no ha acabado';
                        } else if (Administrador.getCondicion() === 'clave') {
                            result.error = 'Debes cambiar la contraseña, ya han pasado 90 días. Se te ha enviado un correo para realizar el proceso.';
                        } else if (Administrador.getCondicion() === 'tiempo') {
                            result.error = 'Ha intentado iniciar sesión demasiadas veces. Su cuenta será bloqueada por un día.';
                        } else if (Administrador.getCondicion() === 'bloqueado') {
                            result.error = 'Su cuenta ha sido bloqueada. Contacte a los administradores.';
                        } else {
                            // Autenticación exitosa
                            const token = jwt.sign({ idAdministrador: Administrador.id }, process.env.CLAVE_JWT, { expiresIn: '1h' });
                            result.status = 1;
                            result.message = 'Autenticación exitosa';
                            result.token = token;
                        }
                    } else {
                        // Si las credenciales son incorrectas, agregamos un intento
                        if (Administrador.addAttempt()) {
                            result.error = 'Credenciales incorrectas';
                        } else {
                            result.exception = 'Error en el servidor';
                        }
                    }

                    // Reiniciamos la condición del administrador
                    Administrador.resetCondition();
                    break;
                // Recuperar contraseña
                case 'recoverPassword':
                    // Lógica para recuperación de contraseña
                    break;
                // Autenticación de dos pasos
                case 'twoFactorAuth':
                    // Lógica para 2FA
                    break;

                default:
                    result.error = 'Acción no disponible fuera de la sesión';
            }
        }
    }
    catch (error) {
        result.exception = error.message;
    }

    res.json(result);
});

module.exports = router;
