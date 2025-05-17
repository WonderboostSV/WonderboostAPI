CREATE TABLE productos (
	id_producto CHAR(36) NOT NULL PRIMARY KEY,
	nombre_producto VARCHAR(100) NOT NULL,
	descripcion_producto TEXT NOT NULL,
	precio_producto DECIMAL(10, 2) UNSIGNED NOT NULL,
	tipo_precio_producto ENUM ('Fijo', 'Negociable') DEFAULT 'Fijo',
	estado_producto BOOLEAN DEFAULT 1,
	id_subcategoria CHAR(36) NOT NULL, 
	id_empresa CHAR(36) NOT NULL,
	CONSTRAINT fk_producto_subcategoria FOREIGN KEY (id_subcategoria) REFERENCES subcategorias (id_subcategoria),
	CONSTRAINT fk_producto_empresa FOREIGN KEY (id_empresa) REFERENCES empresas (id_empresa),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);