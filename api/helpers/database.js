// Cargar variables de entorno desde un archivo .env
const properties = require('./properties');
const { Sequelize, QueryTypes } = require('sequelize');
const { config } = require('./config');

class Database {
    // Conexión a la base de datos utilizando Sequelize
    static sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.server,
        dialect: config.dialect,
        timezone: properties.TZ,
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
    static async executeRow(query, replacements, transaction = null) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.INSERT,
                replacements,
                transaction, // Incluir transacción si está presente
            });
            return result && result[1] > 0; // `result[1]` representa `affectedRows`
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }
    
    // Método para ejecutar procedimientos almacenados dependiendo del gestor de base de datos que se este utilizando
    static async executeProcedure(procedureName, params = [], transaction = null) {
        try {
            await this.connect();
            const query =
                config.dialect === 'mysql'
                    ? `CALL ${procedureName}(${params.map(() => '?').join(', ')})`
                    : `EXEC ${procedureName} ${params.map(() => '?').join(', ')}`;
            return await this.sequelize.query(query, {
                type: QueryTypes.RAW,
                replacements: params,
                transaction,
            });
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }
    
    // Método para obtener el ID de la última fila insertada
    static async getLastRow(query, replacements, transaction = null) {
        try {
            await this.executeRow(query, replacements);
            const result = await this.sequelize.query('SELECT LAST_INSERT_ID() AS insertId;', {
                type: QueryTypes.SELECT,
                transaction, // Incluir transacción si está presente
            });
            return result[0] ? result[0].insertId : 0;
        } catch (err) {
            this.setException(err.name, err.message);
            return 0;
        }
    }

    // Método para seleccionar el último ID insertado
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
    static async getRow(query, replacements = [], transaction = null) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.SELECT,
                replacements,
                transaction, // Incluir transacción si está presente
            });
            return result.length ? result[0] : null;
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }

    // Método para obtener múltiples registros (SELECT)
    static async getRows(query, replacements = [], transaction = null) {
        try {
            await this.connect();
            const result = await this.sequelize.query(query, {
                type: QueryTypes.SELECT,
                replacements,
                transaction, // Incluir transacción si está presente
            });
            return result;
        } catch (err) {
            this.setException(err.name, err.message);
            return false;
        }
    }

    // Método para manejar transacciones
    /**
     * Ejecuta un conjunto de operaciones dentro de una transacción.
     * 
     * @param {Function} callback - Función que contiene las operaciones a ejecutar dentro de la transacción.
     * @returns {*} El resultado del callback si la transacción se completa con éxito, o `false` si ocurre un error.
     */
    static async executeTransaction(callback) {
        const t = await this.sequelize.transaction(); // Inicia una nueva transacción
        try {
            const result = await callback(t); // Ejecuta las operaciones pasando la transacción activa
            await t.commit(); // Confirma la transacción si todo salió bien
            return result; // Retorna el resultado del callback
        } catch (err) {
            await t.rollback(); // Reversión de la transacción en caso de error
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
