CREATE TABLE solicitudes_permisos_venta (
	id_solicitud CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	id_empresa CHAR(36) NOT NULL,
	estado_solicitud ENUM ('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
	observaciones TEXT NULL,
	CONSTRAINT fk_solicitud_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	CONSTRAINT fk_solicitud_empresa FOREIGN KEY (id_empresa) REFERENCES empresas (id_empresa),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);
