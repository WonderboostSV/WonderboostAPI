const messages = {
    // Mensajes de éxito
    success: {
        create: (instance) => `${instance} creado correctamente.`,
        update: (instance) => `${instance} modificado correctamente.`,
        delete: (instance) => `${instance} eliminado correctamente.`,
        search: (count) => `Existen ${count} coincidencias.`,
        readAll: (count) => `Existen ${count} registros.`,
        state: (instance) => `Estado ${instance} modificado correctamente.`,
        login: `Autenticación exitosa.`,
        test: `Testeando metodo`,
    },
    // Mensajes de error
    error: {
        create: (instance) =>`Ocurrió un problema al crear ${instance}.`,
        update: (instance) =>`Ocurrió un problema al modificar ${instance}.`,
        delete: (instance) =>`Ocurrió un problema al eliminar ${instance}.`,
        search: `No hay coincidencias.`,
        readAll: (instance) => `No existen ${instance} registrados.`,
        readOne: (instance) => `${instance} incorrecto.`,
        state: (instance) => `Ocurrió un problema al alterar el estado ${instance}.`,
        login: `Credenciales incorrectas.`,
        validation: `Datos de entrada inválidos.`,
        invalid: (instance) => `${instance} invalido.`,
        pass: `Contraseñas diferentes.`,
        session: `Acción no válida dentro de la sesión.`,
        action: `Acción no válida.`,
        server: `Error interno en el servidor.`,
        unauthorized: `No autorizado.`,
    },
    // Mensajes personalizados según condiciones
    conditions: {
        temporizador: `Intento iniciar sesión varias veces y su tiempo de bloqueo aún no ha acabado.`,
        clave: `Debes cambiar la contraseña, ya han pasado 90 días.`,
        tiempo: `Ha intentado iniciar sesión demasiadas veces. Su cuenta será bloqueada por un día.`,
        bloqueado: `Su cuenta ha sido bloqueada. Contacte a los Administradores.`,
    },
};

module.exports = messages;