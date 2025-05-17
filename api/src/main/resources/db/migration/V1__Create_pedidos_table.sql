CREATE TABLE pedidos (
	id_pedido CHAR(36) NOT NULL PRIMARY KEY,
	estado_pedido ENUM (
		'Pendiente',
		'Enviado',
		'En camino',
		'Cancelado',
		'Negociando'
	) DEFAULT 'Pendiente',
	fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
	direccion_pedido VARCHAR(255) NOT NULL,
	id_cliente CHAR(36) NOT NULL,
	CONSTRAINT fk_cliente_pedido FOREIGN KEY (id_cliente) REFERENCES usuarios (id_usuario),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);