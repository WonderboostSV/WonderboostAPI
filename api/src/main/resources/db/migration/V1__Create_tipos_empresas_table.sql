CREATE TABLE tipos_empresas (
	id_tipo_empresa CHAR(36) NOT NULL PRIMARY KEY,
	tipo_empresa VARCHAR(50) NOT NULL,
	CONSTRAINT uq_tipo_empresa_unico UNIQUE (tipo_empresa),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);