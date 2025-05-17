CREATE TABLE permisos_roles (
	id_permiso_rol CHAR(36) NOT NULL PRIMARY KEY,
	id_rol_administrador CHAR(36) NOT NULL,
	id_seccion CHAR(36) NOT NULL,
	CONSTRAINT fk_permiso_rol_administrador FOREIGN KEY (id_rol_administrador) REFERENCES roles_administradores (id_rol_administrador),
	CONSTRAINT fk_permiso_rol_seccion FOREIGN KEY (id_seccion) REFERENCES secciones_sistema (id_seccion),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);