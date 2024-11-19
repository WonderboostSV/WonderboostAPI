require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const { config } = require('./config');

class Database {
    // Conexión a la base de datos utilizando Sequelize
    static sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.server,
        dialect: 'mysql',
        timezone: process.env.TZ,
        logging: false, // Desactiva el logging de Sequelize, si es necesario
    });
    static error = null;

    // Método para conectar con la base de datos
    static async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Conexión a la base de datos establecida con éxito.');
        } catch (err) {
            this.setException(err.name, err.message);
        }
    }

    // Método para ejecutar sentencias SQL
    static async executeRow(query, replacements) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.INSERT,
                replacements,
            });
            return result && result[1] > 0; // `result[1]` representa `affectedRows`
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }

    // Método para obtener el ID de la última fila insertada
    static async getLastRow(query, replacements) {
        try {
            await this.executeRow(query, replacements);
            const result = await this.sequelize.query('SELECT LAST_INSERT_ID() AS insertId;', {
                type: QueryTypes.SELECT,
            });
            return result[0] ? result[0].insertId : 0;
        } catch (err) {
            this.setException(err.name, err.message);
            return 0;
        }
    }

    // Metodo para seleccionar el ultimo id insertado
    static async getLastRowId() {
        try {
            const result = await this.sequelize.query('SELECT LAST_INSERT_ID() AS insertId;', {
                type: QueryTypes.SELECT,
            });
            return result[0] ? result[0].insertId : null;
        } catch (err) {
            this.setException(err.name, err.message);
            return null;
        }
    }

    // Método para obtener un solo registro (SELECT)
    static async getRow(query, replacements = []) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.SELECT,
                replacements,
            });
            return result.length ? result[0] : null;
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }

    // Método para obtener múltiples registros (SELECT)
    static async getRows(query, replacements = []) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.SELECT,
                replacements,
            });
            return result;
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }

    // Método para establecer un error personalizado
    static setException(name, message) {
        this.error = `${message}\n`;
        if (/45000/.test(message)) {
            if (/Correo electrónico ya existe/.test(message)) {
                this.error = 'El correo electrónico introducido ya existe';
            } else if (/DUI ya existe/.test(message)) {
                this.error = 'El DUI introducido ya existe';
            } else if (/Nombre de usuario ya existe/.test(message)) {
                this.error = 'El nombre de usuario introducido ya existe';
            } else if (/El usuario no existe/.test(message)) {
                this.error = 'El usuario no existe';
            } else if (/Formato de correo electrónico no válido/.test(message)) {
                this.error = 'El formato del correo electrónico no es válido';
            } else {
                this.error = 'Error con alguno de estos campos: correo, DUI, nombre de usuario';
            }
        } else {
            switch (name) {
                case 'SequelizeHostNotFoundError':
                    this.error = 'Servidor desconocido';
                    break;
                case 'SequelizeConnectionError':
                    this.error = 'Error de conexión a la base de datos';
                    break;
                case 'SequelizeAccessDeniedError':
                    this.error = 'Acceso denegado';
                    break;
                case 'SequelizeDatabaseError':
                    if (/ER_NO_SUCH_TABLE/.test(message)) {
                        this.error = 'Tabla no encontrada';
                    } else if (/ER_BAD_FIELD_ERROR/.test(message)) {
                        this.error = 'Columna no encontrada';
                    }
                    break;
                case 'SequelizeUniqueConstraintError':
                    this.error = 'Uno de los datos ya se encuentra registrado en el sistema.';
                    break;
                default:
                    this.error = message;
            }
        }
    }
    

    // Método para obtener el mensaje de error actual
    static getException() {
        return this.error;
    }
}

module.exports = Database;
