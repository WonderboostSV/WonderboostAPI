CREATE TABLE producto_filtro (
	id_producto CHAR(36) NOT NULL,
	id_filtro CHAR(36) NOT NULL,
	valor_filtro VARCHAR(100) NOT NULL,
	PRIMARY KEY (id_producto, id_filtro),
	CONSTRAINT fk_producto_filtro FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
	CONSTRAINT fk_filtro_producto FOREIGN KEY (id_filtro) REFERENCES filtros (id_filtro),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);