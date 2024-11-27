// Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
require('dotenv').config();
const express = require('express');
const router = express.Router();
const AdministradoresData = require('../../models/data/administradores_data');
const Validator = require('../../helpers/validator');
const jwt = require('jsonwebtoken'); // Para verificar el JWT

// Constantes de campos
const FIELDS = {
    ID: "idAdministrador",
    NOMBRE: "nombreAdministrador",
    CORREO: "correoAdministrador",
    CLAVE: "claveAdministrador",
    TELEFONO: "telefonoAdministrador",
    DUI: "duiAdministrador",
    NACIMIENTO: "nacimientoAdministrador",
    ESTADO: "estadoAdministrador",
    DIRECCION: "direccionAdministrador",
    CLAVE_CONFIRMAR: "confirmarClave",
    BUSCAR: "search"
};
// POST: Maneja metodos de creación de datos
router.post('/', async (req, res) => {
    const { action } = req.query;
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const Administrador = new AdministradoresData();

    try {
        if (req.session.idAdministrador && req.user) {
            switch (action) {
                // Crear fila
                case 'createRow':
                    req.body = Validator.validateForm(req.body);
                    if (
                        !Administrador.setNombre(req.body[FIELDS.NOMBRE]) ||
                        !Administrador.setCorreo(req.body[FIELDS.CORREO]) ||
                        !Administrador.setClave(req.body[FIELDS.CLAVE], req.body[FIELDS.NOMBRE], req.body[FIELDS.NACIMIENTO], req.body[FIELDS.TELEFONO], req.body[FIELDS.CORREO]) ||
                        !Administrador.setTelefono(req.body[FIELDS.TELEFONO]) ||
                        !Administrador.setDUI(req.body[FIELDS.DUI]) ||
                        !Administrador.setDireccion(req.body[FIELDS.DIRECCION]) ||
                        !Administrador.setNacimiento(req.body[FIELDS.NACIMIENTO])
                    ) {
                        result.error = Administrador.getDataError();
                    } else if (req.body[FIELDS.CLAVE] !== req.body[FIELDS.CLAVE_CONFIRMAR]) {
                        result.error = 'Contraseñas diferentes';
                    } else if (await Administrador.createRow()) {
                        result.status = 1;
                        result.message = 'Administrador creado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al crear el Administrador';
                    }
                    break;
                // Buscar datos
                case 'searchRows':
                    if (!Validator.validateSearch(req.body[FIELDS.BUSCAR])) {
                        result.error = Validator.getSearchError();
                    } else {
                        result.dataset = await Administrador.searchRows(req.body[FIELDS.BUSCAR]);
                        if (result.dataset && result.dataset.length > 0) {
                            result.status = 1;
                            result.message = `Existen ${result.dataset.length} coincidencias`;
                        } else {
                            result.error = 'No hay coincidencias';
                        }
                    }
                    break;
                default:
                    result.error = 'Acción POST no válida dentro de la sesión';
            }
        } else {
            switch (action) {
                // Inicio de sesión
                case 'logIn':
                    req.body = Validator.validateForm(req.body);
                    // Llamamos al método checkUser del handler
                    const user = await Administrador.checkUser(req.body[FIELDS.CORREO], req.body[FIELDS.CLAVE], req);
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
                // Registro
                case 'signUp':
                    result.message = 'Acción signUp ejecutada';
                    // Lógica para signUp
                    break;
                default:
                    result.error = 'Acción no disponible fuera de la sesión';
            }
        }
    } catch (error) {
        result.exception = error.message;
    }
    res.json(result);
});
// PUT: Maneja metodos de edición de datos
router.put('/', async (req, res) => {
    const { action } = req.query;
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const Administrador = new AdministradoresData();

    try {
        if (req.session.idAdministrador && req.user) {
            switch (action) {
                // Actualizar un campo
                case 'updateRow':
                    req.body = Validator.validateForm(req.body);
                    if (
                        !Administrador.setId(req.body[FIELDS.ID]) ||
                        !Administrador.setNombre(req.body[FIELDS.NOMBRE]) ||
                        !Administrador.setCorreo(req.body[FIELDS.CORREO]) ||
                        !Administrador.setTelefono(req.body[FIELDS.TELEFONO]) ||
                        !Administrador.setDUI(req.body[FIELDS.DUI]) ||
                        !Administrador.setDireccion(req.body[FIELDS.DIRECCION]) ||
                        !Administrador.setNacimiento(req.body[FIELDS.NACIMIENTO]) ||
                        !Administrador.setEstado(req.body[FIELDS.ESTADO] ? 1 : 0)
                    ) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.updateRow()) {
                        result.status = 1;
                        result.message = 'Administrador modificado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al modificar el Administrador';
                    }
                    break;
                // Cambiar el estado
                case 'changeState':
                    if (!Administrador.setId(req.body[FIELDS.ID])) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.changeState()) {
                        result.status = 1;
                        result.message = 'Estado del Administrador cambiado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al alterar el estado del Administrador';
                    }
                    break;
                default:
                    result.error = 'Acción no disponible dentro de la sesión';
            }
        } else {
            switch (action) {
                // Recuperar contraseña
                case 'recoverPassword':
                    // Lógica para recuperación de contraseña
                    break;
                default:
                    result.error = 'Acción no disponible fuera de la sesión';
            }
        }
    } catch (error) {
        result.exception = error.message;
    }
    res.json(result);
});
// DELETE: Maneja metodos de eliminación de datos
router.delete('/', async (req, res) => {
    const { action } = req.query;
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const Administrador = new AdministradoresData();

    try {
        if (req.session.idAdministrador && req.user) {
            switch (action) {
                // Eliminar
                case 'deleteRow':
                    if (!Administrador.setId(req.body[FIELDS.ID])) {
                        result.error = Administrador.getDataError();
                    } else if (await Administrador.deleteRow()) {
                        result.status = 1;
                        result.message = 'Administrador eliminado correctamente';
                    } else {
                        result.error = 'Ocurrió un problema al eliminar el Administrador';
                    }
                    break;
                default:
                    result.error = 'Acción no disponible dentro de la sesión';
            }
        } else {
            switch (action) {

                default:
                    result.error = 'Acción no disponible fuera de la sesión';
            }
        }
    } catch (error) {
        result.exception = error.message;
    }
    res.json(result);
});
// GET: Maneja metodos de lectura de datos
router.get('/', async (req, res) => {
    const { action } = req.query;
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const Administrador = new AdministradoresData();

    try {
        if (req.session.idAdministrador && req.user) {
            switch (action) {
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
                    if (!Administrador.setId(req.body[FIELDS.ID])) {
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
                default:
                    result.error = 'Acción no disponible dentro de la sesión';
            }
        } else {
            switch (action) {

                default:
                    result.error = 'Acción no disponible fuera de la sesión';
            }
        }
    } catch (error) {
        result.exception = error.message;
    }
    res.json(result);
});

module.exports = router;
