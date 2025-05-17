CREATE TABLE comentarios (
	id_comentario CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	id_producto CHAR(36),
	id_servicio CHAR(36),
	comentario TEXT NOT NULL,
	fecha_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
	estado_comentario BOOLEAN DEFAULT 1,
	CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	CONSTRAINT fk_comentario_producto FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
	CONSTRAINT fk_comentario_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);