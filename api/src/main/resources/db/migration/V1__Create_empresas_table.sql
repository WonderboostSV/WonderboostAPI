CREATE TABLE empresas (
	id_empresa CHAR(36) NOT NULL PRIMARY KEY,
	nombre_empresa VARCHAR(200) NOT NULL,
	id_tipo_empresa CHAR(36),
	CONSTRAINT fk_tipo_de_la_empresa FOREIGN KEY (id_tipo_empresa) REFERENCES tipos_empresas (id_tipo_empresa),
	logo_empresa VARCHAR(255) NULL,
	descripcion_empresa TEXT NULL,
	numero_registro_fiscal VARCHAR(20) NULL UNIQUE,
	estado_empresa BOOLEAN DEFAULT 1,
	pagina_web_empresa VARCHAR(255) NULL,
	id_propietario CHAR(36) NOT NULL,
	CONSTRAINT fk_propietario_empresa FOREIGN KEY (id_propietario) REFERENCES usuarios (id_usuario),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);