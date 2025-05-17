CREATE TABLE roles_administradores (
	id_rol_administrador CHAR(36) NOT NULL PRIMARY KEY,
	rol_administrador VARCHAR(60) NOT NULL,
	CONSTRAINT uq_rol_administrador_unico UNIQUE (rol_administrador),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);