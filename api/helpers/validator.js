const fs = require('fs'); // Módulo para trabajar con el sistema de archivos
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios

class Validator {
    constructor() {
        this.filename = null;
        this.passwordError = null;
        this.fileError = null;
        this.searchValue = null;
        this.searchError = null;
    }

    // Método para obtener el error al validar una contraseña.
    getPasswordError() {
        return this.passwordError;
    }

    // Método para obtener el nombre del archivo validado.
    getFilename() {
        return this.filename;
    }

    // Método para obtener el error al validar un archivo.
    getFileError() {
        return this.fileError;
    }

    // Método para obtener el valor de búsqueda.
    getSearchValue() {
        return this.searchValue;
    }

    // Método para obtener el error al validar una búsqueda.
    getSearchError() {
        return this.searchError;
    }

    // Método para sanear todos los campos de un formulario.
    validateForm(fields) {
        return fields.map(field => field.trim());
    }

    // Método para validar un número natural (entero mayor o igual a 1).
    validateNaturalNumber(value) {
        return Number.isInteger(value) && value >= 1;
    }

    // Método para validar un número que sea mayor o igual a 0 .
    validatePositiveNumber(value) {
        return Number.isInteger(value) && value >= 0;
    }

    // Método para validar un archivo de imagen.
    validateImageFile(file, dimension) {
        const validTypes = ['image/jpeg', 'image/png'];
        if (file && file.mimetype && validTypes.includes(file.mimetype)) {
            if (file.size > 2097152) {
                this.fileError = 'El tamaño de la imagen debe ser menor a 2MB';
                return false;
            } else {
                const extension = file.mimetype.split('/')[1];
                this.filename = `${Date.now()}.${extension}`;
                return true;
            }
        } else {
            this.fileError = 'El tipo de imagen debe ser jpg o png';
            return false;
        }
    }

    // Método para validar un archivo pdf o docx.
    static validateFile(file, maxSizeMB) {
        if (file && file.path) {
            const fs = require('fs');
            const mime = require('mime-types');

            const fileSizeMB = fs.statSync(file.path).size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                this.fileError = `El tamaño del archivo debe ser menor a ${maxSizeMB}MB`;
                return false;
            }

            const fileType = mime.lookup(file.path);
            if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const extension = file.name.split('.').pop().toLowerCase();
                if (extension === 'pdf' || extension === 'docx') {
                    this.filename = `${Date.now()}.${extension}`;
                    return true;
                } else {
                    this.fileError = 'El tipo de archivo debe ser PDF o DOCX';
                    return false;
                }
            } else {
                this.fileError = 'El archivo debe ser de tipo PDF o DOCX';
                return false;
            }
        } else {
            this.fileError = 'No se pudo subir el archivo.';
            return false;
        }
    }

    /*
     *   Método para validar un dato booleano.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateBoolean(value) {
        return value === true || value === false;
    }

    /*
     *   Método para validar una cadena de texto (letras, digitos, espacios en blanco y signos de puntuación).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateString(value) {
        return /^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s,;.]+$/.test(value);
    }

    // Validar el número de elementos que tiene un arreglo
    static validateNumberArray(value) {
        return Array.isArray(value) && value.length === 6 && value.every(item => !isNaN(item));
    }

    /*
    *   Método para validar una cadena de texto (letras, dígitos, espacios en blanco, signos de puntuación y guiones).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    static validateStringText(value) {
        return /^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s,;.\-+]+$/.test(value);
    }

    /* 
    *   Método para validar una cadena de texto (letras, dígitos, espacios en blanco, signos de puntuación y guiones).
    *   Parámetros: $value (dato a validar).
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    static validateTextOrtographic(value) {
        return /^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s,;.\-+\/¿?\)!]*$/.test(value);
    }

    /*
     *   Método para validar un dato alfabético (letras y espacios en blanco).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateAlphabetic(value) {
        return /^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/.test(value);
    }

    /*
     *   Método para validar un dato alfanumérico (letras, dígitos y espacios en blanco).
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateAlphanumeric(value) {
        return /^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s]+$/.test(value);
    }

    /*
     *   Método para validar la longitud de una cadena de texto.
     *   Parámetros: $value (dato a validar), $min (longitud mínima) y $max (longitud máxima).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateLength(value, min, max) {
        return typeof value === 'string' && value.length >= min && value.length <= max;
    }

    /*
     *   Método para validar un dato monetario.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateMoney(value) {
        return /^[0-9]+(?:\.[0-9]{1,2})?$/.test(value);
    }

    // Método para validar un correo electrónico.
    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    // Método para validar una contraseña.
    validatePassword(value, name, lastname, birthday, phone, email) {
        if (value.length < 8) {
            this.passwordError = 'Clave menor a 8 caracteres';
            return false;
        } else if (value.length > 72) {
            this.passwordError = 'Clave mayor a 72 caracteres';
            return false;
        } else if (/\s/.test(value)) {
            this.passwordError = 'Clave contiene espacios en blanco';
            return false;
        } else if (!/\W/.test(value)) {
            this.passwordError = 'Clave debe contener al menos un caracter especial';
            return false;
        } else if (!/\d/.test(value)) {
            this.passwordError = 'Clave debe contener al menos un dígito';
            return false;
        } else if (!/[a-z]/.test(value)) {
            this.passwordError = 'Clave debe contener al menos una letra en minúsculas';
            return false;
        } else if (!/[A-Z]/.test(value)) {
            this.passwordError = 'Clave debe contener al menos una letra en mayúsculas';
            return false;
        }

        const sensitiveData = {
            'nombre': name,
            'apellido': lastname,
            'fecha de nacimiento': birthday,
            'teléfono': phone,
            'email': email
        };

        const valueLower = value.toLowerCase();
        for (const [label, data] of Object.entries(sensitiveData)) {
            if (data) {
                const dataLower = data.toLowerCase();
                for (let i = 0; i <= dataLower.length - 3; i++) {
                    const substring = dataLower.substring(i, i + 3);
                    if (valueLower.includes(substring)) {
                        this.passwordError = `Clave contiene parte del ${label} del usuario: '${substring}'`;
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Método para validar un número telefónico.
    validatePhone(value) {
        const phoneRegex = /^[267][0-9]{3}-[0-9]{4}$/;
        return phoneRegex.test(value);
    }

    // Método para validar un DUI.
    validateDUI(value) {
        const duiRegex = /^[0-9]{8}-[0-9]{1}$/;
        return duiRegex.test(value);
    }

    /*
     *   Método para validar una fecha.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateDate(value) {
        const dateParts = value.split('-').map(part => parseInt(part, 10));
        if (dateParts.length !== 3) return false;

        const [year, month, day] = dateParts;
        const isValidDate = new Date(year, month - 1, day).getDate() === day;
        return isValidDate;
    }

    /*
     *   Método para validar un valor de búsqueda.
     *   Parámetros: $value (dato a validar).
     *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
     */
    static validateSearch(value) {
        if (value.trim() === '') {
            this.searchError = 'Ingrese un valor para buscar';
            return false;
        } else if (value.trim().split(/\s+/).length > 3) {
            this.searchError = 'La búsqueda contiene más de 3 palabras';
            return false;
        } else if (this.validateStringText(value)) {
            this.searchValue = value;
            return true;
        } else {
            this.searchError = 'La búsqueda contiene caracteres prohibidos';
            return false;
        }
    }

    /*
     *   Método para validar un archivo al momento de subirlo al servidor.
     *   Parámetros: $file (archivo), $path (ruta del archivo) y $name (nombre del archivo).
     *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
     */
    static saveFile(file, path) {
        if (!file) {
            return false;
        }
        try {
            fs.renameSync(file.path, path + this.filename);
            return true;
        } catch (error) {
            console.error('Error al mover el archivo:', error);
            return false;
        }
    }

    /*
     *   Método para validar el cambio de un archivo en el servidor.
     *   Parámetros: $file (archivo), $path (ruta del archivo) y $old_filename (nombre del archivo anterior).
     *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
     */
    static changeFile(file, path, oldFilename) {
        if (!this.saveFile(file, path)) {
            return false;
        }
        return this.deleteFile(path, oldFilename);
    }

    /*
     *   Método para validar un archivo al momento de borrarlo del servidor.
     *   Parámetros: $path (ruta del archivo) y $filename (nombre del archivo).
     *   Retorno: booleano (true si el archivo fue borrado del servidor o false en caso contrario).
     */
    static deleteFile(path, filename) {
        if (filename === 'default.png') {
            return true;
        }
        try {
            fs.unlinkSync(path + filename);
            return true;
        } catch (error) {
            console.error('Error al eliminar el archivo:', error);
            return false;
        }
    }

    /*
    * Método para validar un formato de hora (HH:MM[:SS]).
    * @param {string} value - El dato a validar.
    * @returns {string|boolean} - Retorna la hora en formato "HH:MM:SS" si es válida, o `false` si no cumple con el formato.
    */
    static validateTime(value) {
        // Expresión regular para verificar el formato de hora HH:MM[:SS]
        const timeRegex = /^(2[0-3]|[01][0-9]):([0-5][0-9])(?::([0-5][0-9]))?$/;
        const matches = value.match(timeRegex);
        if (matches) {
            const hour = matches[1];
            const minute = matches[2];
            const second = matches[3] || '00'; // Si los segundos no están presentes, se asigna '00'
            return `${hour}:${minute}:${second}`;
        }
        // Si no cumple con el formato, retorna false
        return false;
    }

    /**
     * Método para validar una fecha de nacimiento (mayor de 18 años).
     * @param {string} value - La fecha a validar en formato "YYYY-MM-DD".
     * @param {number} min - La edad mínima permitida.
     * @param {number} max - La edad máxima permitida.
     * @returns {boolean} - Retorna `true` si la fecha es válida y dentro del rango de edad, `false` en caso contrario.
     */
    static validateDateBirthday(value, min, max) {
        const dateValue = new Date(value);
        const currentDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(currentDate.getFullYear() - min);
        const maxDate = new Date();
        maxDate.setFullYear(currentDate.getFullYear() - max);

        if (dateValue > minDate || dateValue < maxDate) {
            return false;
        }

        // Verifica que la fecha sea válida
        return !isNaN(dateValue.getTime());
    }

    /**
     * Método para validar un número decimal positivo.
     * @param {number|string} value - El valor a validar.
     * @returns {boolean} - Retorna `true` si el valor es un número decimal positivo, `false` en caso contrario.
     */
    static validatePositiveDecimal(value) {
        const number = parseFloat(value);
        return !isNaN(number) && number > 0;
    }

    /**
     * Método para validar un formato de fecha y hora (DATETIME) en formato ISO 8601.
     * @param {string} value - El dato a validar en formato "YYYY-MM-DDTHH:MM:SS".
     * @returns {string|boolean} - Retorna la fecha en formato "YYYY-MM-DD HH:MM:SS" si es válida, o `false` si no cumple con el formato.
     */
    static validateDateTime(value) {
        const dateTimeRegex = /^(\d{4})-(\d{2})-(\d{2})T(2[0-3]|[01][0-9]):([0-5][0-9])(?::([0-5][0-9]))?$/;
        const matches = value.match(dateTimeRegex);
        if (matches) {
            const [year, month, day, hour, minute, second = '00'] = matches.slice(1);

            // Verifica que la fecha sea válida
            const isValidDate = !isNaN(new Date(`${year}-${month}-${day}`).getTime());
            if (isValidDate) {
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            }
        }
        return false;
    }


    // Método para generar un salt basado en un DUI
    static generarSalt(dui) {
        const caracteresEspeciales = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
        const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        // Removemos el guion del formato del DUI
        dui = dui.replace(/-/g, '');

        let salt = '';

        for (let i = 0; i < dui.length; i++) {
            let digito = parseInt(dui[i], 10);
            let resultado = 0;

            // Dependiendo de la posición, aplicamos diferentes operaciones matemáticas
            switch (i + 1) {
                case 1:
                    resultado = digito === 0 ? Math.cos(0) + 1 ** 1 : 2 * digito + 3;
                    break;
                case 2:
                    resultado = digito === 0 ? Math.cos(0) + 2 ** 2 : Math.exp(digito - 3);
                    break;
                case 3:
                    resultado = digito === 0 ? Math.cos(0) + 3 ** 3 : Math.log(digito + 1);
                    break;
                case 4:
                    resultado = digito === 0 ? Math.cos(0) + 4 ** 4 : this.factorial(digito) + Math.log(digito + 10);
                    break;
                case 5:
                    resultado = digito === 0 ? Math.cos(0) + 5 ** 5 : Math.pow(digito, 2) * Math.cbrt(digito);
                    break;
                case 6:
                    resultado = digito === 0 ? Math.cos(0) + 6 ** 6 : Math.exp(Math.log10(digito + 1));
                    break;
                case 7:
                    resultado = digito === 0 ? Math.cos(0) + 7 ** 7 : Math.atanh(digito / 10) + Math.acos(digito / 10);
                    break;
                case 8:
                    resultado = digito === 0 ? Math.cos(0) + 8 ** 8 : Math.sqrt(digito) * Math.PI;
                    break;
                case 9:
                    resultado = digito === 0 ? Math.cos(0) + 9 ** 9 : Math.atan(digito) + Math.exp(digito / 10);
                    break;
            }

            resultado = Math.round(resultado);

            if (resultado < 0) {
                resultado = Math.abs(resultado);
                resultado = parseInt(String(resultado).slice(-2), 10);
            } else if (resultado > 99) {
                resultado = parseInt(String(resultado).slice(0, 2), 10);
            }

            let letra = (resultado > 0 && resultado <= 26) ? alfabeto[resultado - 1] : resultado;
            let primerDigito = Math.abs(parseInt(resultado / 10, 10)) % 10;
            let caracterEspecial = caracteresEspeciales[primerDigito % caracteresEspeciales.length];

            salt += `${caracterEspecial}.${resultado}.${letra}`;
        }

        return salt;
    }

    // Método auxiliar para calcular el factorial
    static factorial(n) {
        return n <= 1 ? 1 : n * this.factorial(n - 1);
    }

}

module.exports = Validator;
