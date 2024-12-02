const db = require('../../helpers/database'); // Importamos el archivo de la base de datos
const { generateJWT } = require('../../helpers/jwt');
const bcrypt = require('bcryptjs');

class AdministradoresHandler {
    // Constructor con cada una de las variables que se instanciarian
    constructor(id = null, nombre = null, correo = null, clave = null, telefono = null, dui = null, nacimiento = null, estado = null, direccion = null, alias = null, condicion = null, dias = null) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.clave = clave;
        this.telefono = telefono;
        this.dui = dui;
        this.nacimiento = nacimiento;
        this.estado = estado;
        this.direccion = direccion;
        this.alias = alias;
        this.condicion = condicion;
        this.dias = dias;
    }

    // Metodos para el caso de que no haya una sesión de administrador activa
    // Método para el login
    async checkUser(username, password) {
        try {
            const procedureName = 'autenticar_administrador';
            const params = [
                username
            ];
            // Llamar al procedimiento almacenado
            const result = await db.executeProcedure(procedureName, params);

            if (!result || result.length === 0) return false;

            const data = result[0]; // Se espera un solo registro
            const now = new Date();
            const tiempoBloqueo = data.TIEMPO ? new Date(data.TIEMPO) : null;

            // Verificar si hay un temporizador activo
            if (tiempoBloqueo && tiempoBloqueo > now) {
                this.condicion = 'temporizador';
                return false;
            }

            // Reiniciar bloqueos si ya pasó el tiempo
            if (tiempoBloqueo && tiempoBloqueo <= now) {
                this.alias = data.ALIAS;
    
                const transactionResult = await db.executeTransaction(async (transaction) => {
                    await db.executeProcedure('reiniciar_tiempo_bloqueo', [null, this.alias], transaction);
                    await db.executeProcedure('cambiar_estado_bloqueado', [this.alias], transaction);
                    await db.executeProcedure('reiniciar_intentos', [this.alias], transaction);
                    return true; // Confirmar si todo se ejecutó correctamente
                });
    
                if (!transactionResult) {
                    this.condicion = 'error_transaccion';
                    return false;
                }
            }

            // Verificar si el usuario está bloqueado
            if (data.ESTADO === 'Bloqueado') {
                this.condicion = 'bloqueado';
                return false;
            }

            // Verificar si la contraseña expiró
            if (data.DIAS >= 90) {
                this.correo = data.CORREO;
                this.condicion = 'clave';
                return false;
            }

            // Verificar los intentos y la contraseña
            if (data.INTENTOS >= 3) {
                this.condicion = 'tiempo';
                return false;
            }

            // Validar la contraseña y verificar si esta correcta
            const isPasswordValid = bcrypt.compareSync(password, data.CLAVE);

            if (!isPasswordValid) return false;
            
            // Generar un JWT con los datos del usuario
            const userData = {
                id: data.ID,
                alias: data.ALIAS,
                correo: data.CORREO,
                nombreCompleto: data.NOMBRECOMPLETO,
                foto: data.FOTO,
            };
            const token = generateJWT(userData);
    
            // Devuelve el token como parte de la respuesta
            return { status: 'success', token };
        } catch (error) {
            console.error('Error en checkUser:', error);
            return false;
        }
    }

    // Método para añadir un intento de inicio de sesión
    async addAttempt() {
        const procedureName = `sumar_intento`;
        const params = [this.alias];
        return await db.executeProcedure(procedureName, params);
    }
    
    // Función que retorna a su estado original la variable de condición
    async resetCondition()
    {
        return this.condicion = null;
    }

    // Metodos para cuando haya una sesión de administrador activa
    // Método para buscar un administrador o varios
    async searchRows(searchValue) {
        const value = '%' + searchValue + '%';
        const sql = `SELECT * FROM vista_tabla_administradores 
                     WHERE NOMBRE LIKE ? OR CORREO LIKE ? OR TELÉFONO LIKE ? OR DUI LIKE ?
                     ORDER BY NOMBRE;`;
        const params = [value, value, value, value];
        return await db.getRows(sql, params);
    }

    // Método para insertar un administrador
    async createRow() {
        const procedureName = 'insertar_administrador';
        const params = [
            this.nombre,
            this.correo,
            this.clave,
            this.telefono,
            this.dui,
            this.direccion,
            this.nacimiento
        ];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para leer todos los administradors
    async readAll() {
        const sql = `SELECT * FROM vista_tabla_administradores ORDER BY NOMBRE;`;
        return await db.getRows(sql);
    }

    // Método para leer un administrador por ID
    async readOne() {
        const sql = `SELECT * FROM vista_tabla_administradores WHERE ID LIKE ?;`;
        const params = [this.id];
        return await db.getRow(sql, params);
    }

    // Método para actualizar un administrador
    async updateRow() {
        const procedureName = `actualizar_administrador`;
        const params = [
            this.id,
            this.nombre,
            this.correo,
            this.telefono,
            this.dui,
            this.direccion,
            this.nacimiento,
            this.estado
        ];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para eliminar un administrador
    async deleteRow() {
        const procedureName = `eliminar_administrador`;
        const params = [this.id];
        return await db.executeProcedure(procedureName, params);
    }

    // Método para cambiar el estado de un administrador
    async changeState() {
        const procedureName = `actualizar_estado_administrador`;
        const params = [this.id];
        return await db.executeProcedure(procedureName, params);
    }
}

module.exports = AdministradoresHandler;
