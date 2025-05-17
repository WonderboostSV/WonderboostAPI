CREATE TABLE tipos_usuarios (
	id_tipo_usuario CHAR(36) NOT NULL PRIMARY KEY,
	cargo_usuario ENUM (
		'Cliente',
		'Emprendedor',
		'Distribuidor',
		'Repartidor'
	),
	tipo_usuario VARCHAR(100) NOT NULL,
	CONSTRAINT uq_tipo_usuario_unico UNIQUE (tipo_usuario),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);