CREATE TABLE usuarios (
	id_usuario CHAR(36) NOT NULL PRIMARY KEY,
	alias_usuario VARCHAR(50) NOT NULL,
	correo_usuario VARCHAR(50) NOT NULL,
	CONSTRAINT uq_correo_usuario_unico UNIQUE (correo_usuario),
	clave_usuario VARCHAR(255) NOT NULL,
	pin_usuario CHAR(4) NULL,
	fecha_creacion DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	id_tipo_usuario CHAR(36),
	CONSTRAINT fk_tipo_del_usuario FOREIGN KEY (id_tipo_usuario) REFERENCES tipos_usuarios (id_tipo_usuario),
	estado_usuario BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);