CREATE TABLE tipos_identificaciones_alternativas (
	id_tipo_identificacion CHAR(36) NOT NULL PRIMARY KEY,
	tipo_identificacion VARCHAR(50) NOT NULL,
	CONSTRAINT uq_tipo_identificacion_unico UNIQUE (tipo_identificacion),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);