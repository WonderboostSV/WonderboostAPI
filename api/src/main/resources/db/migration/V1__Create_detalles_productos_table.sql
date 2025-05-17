CREATE TABLE detalles_producto (
	id_detalle_producto CHAR(36) NOT NULL PRIMARY KEY,
	id_producto CHAR(36) NOT NULL,
	foto_producto VARCHAR(50) NULL,
	id_opcion_filtro CHAR(36) NOT NULL,
	valor_detalle_producto VARCHAR(100) NOT NULL,
	cantidad_disponible INT UNSIGNED NOT NULL,
	CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
	CONSTRAINT fk_detalle_opcion_filtro FOREIGN KEY (id_opcion_filtro) REFERENCES opciones_filtro (id_opcion_filtro),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);