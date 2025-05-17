CREATE TABLE precios_servicio (
	id_precio_servicio CHAR(36) NOT NULL PRIMARY KEY,
	id_servicio CHAR(36) NOT NULL,
	modalidad_precio ENUM ('Por hora', 'Por sesión', 'Mensual', 'Anual') NOT NULL,
	tipo_precio_servicio ENUM ('Fijo', 'Negociable') DEFAULT 'Fijo',
	precio_servicio DECIMAL(10, 2) UNSIGNED NOT NULL,
	CONSTRAINT fk_precio_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);