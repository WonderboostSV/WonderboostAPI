const Validator = require('../../helpers/validator'); // Importamos el archivo de validaciones
const AdministradorHandler = require('../../models/handler/administrador_handler'); // Importamos el handler

class AdministradorData extends AdministradorHandler {
    constructor(id = null, nombre = null, correo = null, clave = null, telefono = null, dui = null, nacimiento = null, estado = null, direccion = null) {
        super(id, nombre, correo, clave, telefono, dui, nacimiento, estado, direccion); // Llamamos al constructor de la clase padre
        this.data_error = null;
        this.filename = null;
    }

    // Validación y asignación del ID del administrador
    setId(value) {
        if (Validator.validateNaturalNumber(value)) {
            this.id = value;
            return true;
        } else {
            this.data_error = 'El identificador del administrador es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del administrador
    setNombre(value, min = 2, max = 100) {
        if (!Validator.validateAlphabetic(value)) {
            this.data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } else if (Validator.validateLength(value, min, max)) {
            this.nombre = value;
            return true;
        } else {
            this.data_error = `El nombre debe tener una longitud entre ${min} y ${max}`;
            return false;
        }
    }

    // Validación y asignación del correo del administrador
    setCorreo(value, min = 8, max = 100) {
        if (!Validator.validateEmail(value)) {
            this.data_error = 'El correo electrónico no es válido';
            return false;
        } else if (Validator.validateLength(value, min, max)) {
            this.correo = value;
            return true;
        } else {
            this.data_error = `El correo debe tener una longitud entre ${min} y ${max}`;
            return false;
        }
    }

    // Validación y asignación de la clave del administrador
    setClave(value, name, birthday, phone, email) {
        if (Validator.validatePassword(value, name, birthday, phone, email)) {
            this.clave = value; // Aquí deberías aplicar el hash si lo necesitas
            return true;
        } else {
            this.data_error = Validator.getPasswordError();
            return false;
        }
    }

    // Validación y asignación del teléfono del administrador
    setTelefono(value) {
        if (Validator.validatePhone(value)) {
            this.telefono = value;
            return true;
        } else {
            this.data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    // Validación y asignación del DUI del administrador
    setDUI(value) {
        if (!Validator.validateDUI(value)) {
            this.data_error = 'El DUI debe tener el formato ########-#';
            return false;
        } else {
            this.dui = value;
            return true;
        }
    }

    // Validación y asignación de la fecha de nacimiento del administrador
    setNacimiento(value, min = 18, max = 122) {
        if (Validator.validateDateBirthday(value, min, max)) {
            this.nacimiento = value;
            return true;
        } else {
            this.data_error = `La fecha de nacimiento no es válida, debe ser mayor a ${min} y menor a ${max} años`;
            return false;
        }
    }

    // Validación y asignación de la dirección del administrador
    setDireccion(value, min = 2, max = 200) {
        if (!Validator.validateTextOrtograpic(value)) {
            this.data_error = 'La dirección contiene caracteres prohibidos';
            return false;
        } else if (Validator.validateLength(value, min, max)) {
            this.direccion = value;
            return true;
        } else {
            this.data_error = `La dirección debe tener una longitud entre ${min} y ${max}`;
            return false;
        }
    }

    // Validación y asignación del estado del administrador
    setEstado(value) {
        if (Validator.validateBoolean(value)) {
            this.estado = value;
            return true;
        } else {
            this.data_error = 'El estado debe ser 1 o 0';
            return false;
        }
    }

    // Método para obtener el error de los datos
    getDataError() {
        return this.data_error;
    }

    // Método para obtener el nombre del archivo de imagen
    getFilename() {
        return this.filename;
    }
}

module.exports = AdministradorData;
