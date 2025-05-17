CREATE TABLE categorias (
	id_categoria CHAR(36) NOT NULL PRIMARY KEY,
	nombre_categoria VARCHAR(100) NOT NULL,
	descripcion_categoria TEXT NULL,
	CONSTRAINT uq_nombre_categoria_unico UNIQUE (nombre_categoria),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);