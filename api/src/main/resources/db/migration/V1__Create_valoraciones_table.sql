CREATE TABLE valoraciones (
	id_valoracion CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	id_producto CHAR(36),
	id_servicio CHAR(36),
	es_like BOOLEAN NOT NULL,
	fecha_valoracion DATETIME DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_valoracion_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	CONSTRAINT fk_valoracion_producto FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
	CONSTRAINT fk_valoracion_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);