const express = require('express');
const router = express.Router();
const AdministradoresData = require('../../models/data/administradores_data');
const Validator = require('../../helpers/validator');

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

// Controlador para manejar las acciones de la API
router.get('/', (req, res) => {
    res.json({ message: 'Recurso no disponible' });
});

router.post('/', async (req, res) => {
    const result = { status: 0, message: null, dataset: null, error: null, exception: null };
    const action = req.query.action;
    const Administrador = new AdministradoresData();

    try {
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
                result.error = 'Acción no disponible';
        }
    } catch (error) {
        result.exception = error.message;
    }

    res.json(result);
});

module.exports = router;
