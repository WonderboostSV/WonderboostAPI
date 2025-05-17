CREATE TABLE tipos_servicios (
	id_tipo_servicio CHAR(36) NOT NULL PRIMARY KEY,
	nombre_tipo_servicio VARCHAR(100) NOT NULL,
	descripcion_tipo_servicio TEXT NULL,
	CONSTRAINT uq_nombre_tipo_servicio UNIQUE (nombre_tipo_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);