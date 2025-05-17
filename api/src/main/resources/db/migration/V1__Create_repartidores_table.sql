CREATE TABLE repartidores (
	id_repartidor CHAR(36) NOT NULL PRIMARY KEY,
	id_usuario CHAR(36) NOT NULL,
	licencia_conduccion VARCHAR(50) NOT NULL,
	tipo_transporte ENUM ('Moto', 'Bicicleta', 'Carro', 'Otro') NOT NULL,
	estado_repartidor BOOLEAN DEFAULT 1,
	id_pais CHAR(36) NULL,
	CONSTRAINT fk_repartidor_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
	CONSTRAINT fk_repartidor_pais FOREIGN KEY (id_pais) REFERENCES paises (id_pais),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);