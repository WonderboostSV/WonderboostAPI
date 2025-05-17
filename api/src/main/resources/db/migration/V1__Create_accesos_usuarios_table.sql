CREATE TABLE accesos_usuario (
	id_acceso CHAR(36) NOT NULL PRIMARY KEY,
	id_tipo_usuario CHAR(36) NOT NULL,
	id_seccion CHAR(36) NOT NULL,
	estado_acceso BOOLEAN DEFAULT 0,
	estado_seccion BOOLEAN NOT NULL,
	CONSTRAINT fk_accesos_del_tipo_de_usuario FOREIGN KEY (id_tipo_usuario) REFERENCES tipos_usuarios (id_tipo_usuario),
	CONSTRAINT fk_permiso_seccion FOREIGN KEY (id_seccion) REFERENCES secciones_sistema (id_seccion),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);