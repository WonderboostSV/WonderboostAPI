CREATE TABLE opciones_filtro (
	id_opcion_filtro CHAR(36) NOT NULL PRIMARY KEY,
	valor_opcion_filtro VARCHAR(100) NOT NULL,
	id_filtro CHAR(36) NOT NULL,
	CONSTRAINT fk_opcion_filtro FOREIGN KEY (id_filtro) REFERENCES filtros (id_filtro),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);