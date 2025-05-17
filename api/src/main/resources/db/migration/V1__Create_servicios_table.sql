
CREATE TABLE servicios (
	id_servicio CHAR(36) NOT NULL PRIMARY KEY,
	nombre_servicio VARCHAR(100) NOT NULL,
	descripcion_servicio TEXT NOT NULL,
	id_tipo_servicio CHAR(36) NOT NULL, 
	id_empresa CHAR(36) NOT NULL,
	estado_servicio BOOLEAN DEFAULT 1,
	fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_servicio_tipo_servicio FOREIGN KEY (id_tipo_servicio) REFERENCES tipos_servicios (id_tipo_servicio),
	CONSTRAINT fk_servicio_empresa FOREIGN KEY (id_empresa) REFERENCES empresas (id_empresa),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);