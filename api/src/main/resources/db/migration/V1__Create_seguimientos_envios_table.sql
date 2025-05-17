CREATE TABLE seguimientos_envios (
	id_seguimiento CHAR(36) NOT NULL PRIMARY KEY,
	id_envio CHAR(36) NOT NULL,
	estado_actual ENUM (
		'Preparando',
		'En tránsito',
		'En entrega',
		'Entregado'
	) NOT NULL,
	descripcion_estado TEXT NULL,
	CONSTRAINT fk_seguimiento_envio FOREIGN KEY (id_envio) REFERENCES envios (id_envio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);