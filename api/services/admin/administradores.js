require('dotenv').config(); // Cargar el paquete 'dotenv' para cargar variables de entorno desde un archivo .env
const express = require('express');
const router = express.Router(); // Este será el primer router, encargado de manejar las acciones cuando se proporcione la jwt
const secondRouter = express.Router(); // Este será el segundo router, encargado de manejar las acciones cuando no se proporcione la jwt
const AdministradoresData = require('../../models/data/administradores_data');
const Validator = require('../../helpers/validator');
const { verifyJWT } = require('../../helpers/jwt');
const messages = require('../../helpers/messages');
const { validateBody, validateAction } = require('../../helpers/petitions');
const Database = require('../../helpers/database');
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
// Acciones para post
const postActions = ['createRow', 'searchRows'];
const postActions2 = ['logIn', 'signUp'];
// Acciones para put
const putActions = ['updateRow', 'changeState'];
const putActions2 = ['recoverPassword'];
// Acciones para delete
const deleteActions = ['deleteRow'];
// Acciones para get
const getActions = ['readAll', 'readOne', 'getUser'];
// Acciones para get
const getActions2 = ['countAll'];
// Instancias para los mensajes
const instance = {
    singular: 'Administrador',
    minuscula: 'del administrador',
    plural: 'administradores',
    error: 'el administrador'
};
// Crear result, con los datos que devolvera el json
const createResult = () => ({ status: 0, message: null, dataset: null, error: null, exception: null });
// Crear la instancia de la clase AdministradoresData
const instanceAdministradorData = () => (new AdministradoresData());
// Asignarle al result el arreglo
const result = createResult();
// Asignarle al objeto Administrador la instancia a AdministradorData
const Administrador = instanceAdministradorData();
// Asegurarse que todas las rutas a continuación requieren verificación de JWT
router.use(verifyJWT);  // Esto asegura que todas las rutas de abajo requieren JWT
// POST: Maneja metodos de creación de datos cuando haya sesión activa
router.post('/', validateBody, validateAction(postActions), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Crear fila
            case 'createRow':
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
                    result.error = messages.error.pass;
                } else if (await Administrador.createRow()) {
                    result.status = 1;
                    result.message = messages.success.create(instance.singular);
                } else {
                    result.error = messages.error.create(instance.error);
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
                        result.message = messages.success.search(result.dataset.length);
                    } else {
                        result.error = messages.error.search;
                    }
                }
                break;
                // Traer datos del usuario
            case 'getUser':
                if (req.user) {
                    result.status = 1;
                    result.username = req.user.alias;
                    result.foto = req.user.foto;
                    result.nombre = req.user.nombreCompleto;
                    result.correo = req.user.correo;
                } else {
                    result.error = messages.error.unauthorized;
                }
                break;
            default:
                result.error = messages.error.session;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// PUT: Maneja metodos de edición de datos
router.put('/', validateBody, validateAction(putActions), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Actualizar un campo
            case 'updateRow':
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
                    result.message = messages.success.update(instance.singular);
                } else {
                    result.error = messages.error.update(instance.error);
                }
                break;
            // Cambiar el estado
            case 'changeState':
                if (!Administrador.setId(req.body[FIELDS.ID])) {
                    result.error = Administrador.getDataError();
                } else if (await Administrador.changeState()) {
                    result.status = 1;
                    result.message = messages.success.state(instance.minuscula);
                } else {
                    result.error = messages.error.state(instance.minuscula);
                }
                break;
            default:
                result.error = messages.error.session;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// DELETE: Maneja metodos de eliminación de datos cuando haya sesión activa
router.delete('/', validateBody, validateAction(deleteActions), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Eliminar
            case 'deleteRow':
                if (!Administrador.setId(req.body[FIELDS.ID])) {
                    result.error = Administrador.getDataError();
                } else if (await Administrador.deleteRow()) {
                    result.status = 1;
                    result.message = messages.success.delete(instance.singular);
                } else {
                    result.error = messages.error.delete(instance.error);
                }
                break;
            default:
                result.error = messages.error.session;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// GET: Maneja metodos de lectura de datos cuando haya sesión activa
router.get('/', validateAction(getActions), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Ver todos
            case 'readAll':
                result.dataset = await Administrador.readAll();
                if (result.dataset && result.dataset.length > 0) {
                    result.status = 1;
                    result.message = messages.success.readAll(result.dataset.length);
                } else {
                    result.error = messages.error.readAll(instance.plural);
                }
                break;
            // Ver uno
            case 'readOne':
                if (!Administrador.setId(req.body[FIELDS.ID])) {
                    result.error = messages.error.readOne(instance.singular);
                } else {
                    result.dataset = await Administrador.readOne();
                    if (result.dataset) {
                        result.status = 1;
                    } else {
                        result.error = messages.error.invalid(instance.singular);
                    }
                }
                break;
            default:
                result.error = messages.error.session;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// POST: Maneja metodos de creación de datos cuando no haya sesión activa
secondRouter.post('/', validateBody, validateAction(postActions2), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Inicio de sesión
            case 'logIn':
                if (!Administrador.setCorreo(req.body[FIELDS.CORREO])) {
                    result.error = Administrador.getDataError();
                }
                else {
                    // Llamamos al método checkUser del handler
                    const user = await Administrador.checkUser(req.body[FIELDS.CORREO], req.body[FIELDS.CLAVE]);
                    // Si el usuario fue encontrado y la autenticación es exitosa
                    if (user) {
                        const conditionMessage = messages.conditions[Administrador.getCondicion()];
                        if (conditionMessage) {
                            result.error = conditionMessage;
                        } else if (user.status === 'success') {
                            result.status = 1;
                            result.message = messages.success.login;
                            result.token = user.token;
                        } else {
                            result.error = messages.error.login;
                        }
                    } else {
                        // Si las credenciales son incorrectas, agregamos un intento
                        if (Administrador.addAttempt()) {
                            result.error = messages.error.login;
                        } else {
                            result.exception = messages.error.server;
                        }
                    }
                }
                // Reiniciamos la condición del administrador
                Administrador.resetCondition();
                break;
            // Registro
            case 'signUp':
                result.message = messages.success.test;
                // Lógica para signUp
                break;
            default:
                result.error = messages.error.action;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// PUT: Maneja metodos de edición de datos cuando no haya sesión activa
secondRouter.put('/', validateBody, validateAction(putActions2), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Recuperar contraseña
            case 'recoverPassword':
                // Lógica para recuperación de contraseña
                break;
            default:
                result.error = messages.error.action;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
// GET: Maneja metodos de lectura de datos cuando haya sesión activa
secondRouter.get('/', validateAction(getActions2), async (req, res) => {
    const { action } = req.query;
    try {
        switch (action) {
            // Ver todos
            case 'countAll':
                result.dataset = await Administrador.countAll();
                if (result.dataset && result.dataset.length > 0) {
                    result.status = 1;
                    result.message = messages.success.readAll(result.dataset.length);
                } else {
                    result.error = messages.error.readAll(instance.plural);
                }
                break;
            default:
                result.error = messages.error.action;
        }
    } catch (error) {
        result.exception = error.message;
    }
    result.exception = Database.getException();
    res.json(result);
});
module.exports = { router, secondRouter };