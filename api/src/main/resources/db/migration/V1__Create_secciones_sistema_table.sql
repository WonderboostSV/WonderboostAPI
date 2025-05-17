CREATE TABLE secciones_sistema (
    id_seccion CHAR(36) NOT NULL PRIMARY KEY,
    nombre_seccion VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    CONSTRAINT uq_nombre_seccion_unico UNIQUE (nombre_seccion),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);