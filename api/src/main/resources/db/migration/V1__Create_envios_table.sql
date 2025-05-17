CREATE TABLE envios (
	id_envio CHAR(36) NOT NULL PRIMARY KEY,
	id_pedido CHAR(36) NOT NULL,
	id_repartidor CHAR(36) NULL, 
	id_distribuidor CHAR(36) NULL,
	estado_envio ENUM (
		'Pendiente',
		'En camino',
		'Entregado',
		'Cancelado'
	) DEFAULT 'Pendiente',
	fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
	fecha_entrega DATETIME NULL,
	direccion_envio VARCHAR(255) NOT NULL,
	CONSTRAINT fk_envio_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
	CONSTRAINT fk_envio_repartidor FOREIGN KEY (id_repartidor) REFERENCES repartidores (id_repartidor),
	CONSTRAINT fk_envio_distribuidor FOREIGN KEY (id_distribuidor) REFERENCES distribuidores (id_distribuidor),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);
