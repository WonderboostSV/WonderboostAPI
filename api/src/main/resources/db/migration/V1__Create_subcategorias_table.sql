CREATE TABLE subcategorias (
	id_subcategoria CHAR(36) NOT NULL PRIMARY KEY,
	nombre_subcategoria VARCHAR(100) NOT NULL,
	id_categoria CHAR(36) NOT NULL,
	descripcion_subcategoria TEXT NULL,
	CONSTRAINT fk_subcategoria_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
	CONSTRAINT uq_nombre_subcategoria_unico UNIQUE (nombre_subcategoria),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);