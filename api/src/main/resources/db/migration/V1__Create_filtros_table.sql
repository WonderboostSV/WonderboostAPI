CREATE TABLE filtros (
	id_filtro CHAR(36) NOT NULL PRIMARY KEY,
	nombre_filtro VARCHAR(100) NOT NULL,
	tipo_filtro ENUM ('Texto', 'Numérico', 'Lista') NOT NULL,
	id_subcategoria CHAR(36) NOT NULL,
	CONSTRAINT fk_filtro_subcategoria FOREIGN KEY (id_subcategoria) REFERENCES subcategorias (id_subcategoria),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);