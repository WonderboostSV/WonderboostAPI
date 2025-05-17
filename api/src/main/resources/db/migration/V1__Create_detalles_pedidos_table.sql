CREATE TABLE detalles_pedidos (
	id_detalle_pedido CHAR(36) NOT NULL PRIMARY KEY,
	id_pedido CHAR(36) NOT NULL,
	id_producto CHAR(36),
	id_servicio CHAR(36),
	cantidad INT NOT NULL,
	precio_unitario DECIMAL(10, 2) NOT NULL,
	CONSTRAINT chk_precio_unitario_positive CHECK (precio_unitario > 0),
	CONSTRAINT chk_cantidad_positive CHECK (cantidad > 0),
	CONSTRAINT fk_detalle_pedido_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
	CONSTRAINT fk_detalle_pedido_producto FOREIGN KEY (id_producto) REFERENCES productos (id_producto),
	CONSTRAINT fk_detalle_pedido_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);