const db = require('../../helpers/database'); // Importamos el archivo de la base de datos

class AdministradoresHandler {
    // Constructor con cada una de las variables que se instanciarian
    constructor(id = null, nombre = null, correo = null, clave = null, telefono = null, dui = null, nacimiento = null, estado = null, direccion = null) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.clave = clave;
        this.telefono = telefono;
        this.dui = dui;
        this.nacimiento = nacimiento;
        this.estado = estado;
        this.direccion = direccion;
    }

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
