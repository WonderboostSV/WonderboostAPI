CREATE TABLE detalles_servicio (
	id_detalle_servicio CHAR(36) NOT NULL PRIMARY KEY,
	id_servicio CHAR(36) NOT NULL,
	nombre_atributo VARCHAR(100) NOT NULL,
	valor_atributo VARCHAR(255) NOT NULL,
	CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);