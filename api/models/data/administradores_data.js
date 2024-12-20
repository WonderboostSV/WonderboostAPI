const Validator = require('../../helpers/validator'); // Importamos el archivo de validaciones
const AdministradorHandler = require('../../models/handler/administrador_handler'); // Importamos el handler
const bcrypt = require('bcryptjs');

class AdministradorData extends AdministradorHandler {
    constructor(
        // Tabla: administradores
        id = null,
        correo = null,
        clave = null,
        alias = null, 
        rol = null,
        estado = null, 
        dias = null,
        // Tabla: datos_administradores
        idd = null,
        nombre = null,
        apellido = null,
        telefono = null,
        dui = null, 
        nacimiento = null, 
        direccion = null,
        foto = null, 
        // Para el inicio de sesión
        condicion = null 
    ) {
        super(id,correo,clave,alias,rol,estado,dias,idd,nombre,apellido,telefono,dui,nacimiento,direccion,foto,condicion); // Llamamos al constructor de la clase padre
        this.data_error = null;
        this.filename = null;
    }

    // Validación y asignación del ID del administrador
    setId(value) {
        if (Validator.validateUUID(value)) {
            this.id = value;
            return true;
        } else {
            this.data_error = 'El identificador del administrador es incorrecto';
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
    setClave(value, alias, email) {
        // Validamos la contraseña usando el validador
        if (Validator.validatePassword(value, alias, email)) {
            // Encriptamos la clave usando bcrypt
            bcrypt.hash(value, 10, (err, hashedPassword) => {
                if (err) {
                    this.data_error = 'Error al encriptar la clave';
                    return false;
                }
                // Asignamos la clave encriptada
                this.clave = hashedPassword;
                return true;
            });
        } else {
            this.data_error = Validator.getPasswordError();
            return false;
        }
    }

    // Validación y asignación del alias del administrador
    setAlias(value, min = 2, max = 25) {
        if (!Validator.validateAlphanumeric(value)) {
            this.data_error = 'El alias debe ser un valor alfanúmerico';
            return false;
        } else if (Validator.validateLength(value, min, max)) {
            this.nombre = value;
            return true;
        } else {
            this.data_error = `El alias debe tener una longitud entre ${min} y ${max}`;
            return false;
        }
    }

    // Validación y asignación del ID del administrador
    setRol(value) {
        if (Validator.validateUUID(value)) {
            this.rol = value;
            return true;
        } else {
            this.data_error = 'El valor del rol es incorrecto';
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

    // Validación y asignación del ID de los datos del administrador
    setIdD(value) {
        if (Validator.validateUUID(value)) {
            this.idd = value;
            return true;
        } else {
            this.data_error = 'El identificador de los datos del administrador es incorrecto';
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

    
    // Validación y asignación del nombre del administrador
    setApellido(value, min = 2, max = 100) {
        if (!Validator.validateAlphabetic(value)) {
            this.data_error = 'El apellido debe ser un valor alfabético';
            return false;
        } else if (Validator.validateLength(value, min, max)) {
            this.apellido = value;
            return true;
        } else {
            this.data_error = `El apellido debe tener una longitud entre ${min} y ${max}`;
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
        if (!Validator.validateTextOrtographic(value)) {
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

    // Validación y asignación del foto del administrador
    setFoto(file, filename = null) {
        if (Validator.validateAndConvertImage(file, 1000)) {
            this.foto = Validator.getFilename();
            return true;
        } else if (Validator.getFileError()) {
            this.data_error = Validator.getFileError();
            return false;
        } else if (filename) {
            this.foto = filename;
            return true;
        } else {
            this.foto = 'default.avif';
            return true;
        }
    }
    // Asignación del nombre del archivo de imagen del administrador.
    setFilename()
    {
        if (data = this.readFilename()) {
            this.filename = data['FOTO'];
            return true;
        } else {
            this.data_error = 'Foto es inexistente';
            return false;
        }
    }

    // Método para obtener la condición
    getCondicion() {
        return this.condicion;
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
