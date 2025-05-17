CREATE TABLE distribuidores (
	id_distribuidor CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	id_empresa CHAR(36) NOT NULL,
	estado_distribuidor BOOLEAN DEFAULT 1,
	experiencia_años INT DEFAULT 0,
	CONSTRAINT fk_distribuidor_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	CONSTRAINT fk_distribuidor_empresa FOREIGN KEY (id_empresa) REFERENCES empresas (id_empresa),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);