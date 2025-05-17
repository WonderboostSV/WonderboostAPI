CREATE TABLE permisos_usuarios (
	id_permisos_usuarios CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	CONSTRAINT fk_id_usuario_permisos FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	permiso_compra BOOLEAN DEFAULT 1,
	permiso_venta BOOLEAN DEFAULT 0,
	permiso_distribuidor BOOLEAN DEFAULT 0,
	permiso_repartidor BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);