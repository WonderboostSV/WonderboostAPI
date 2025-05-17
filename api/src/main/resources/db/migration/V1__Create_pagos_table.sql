CREATE TABLE pagos (
	id_pago CHAR(36) NOT NULL PRIMARY KEY,
	id_pedido CHAR(36) NOT NULL,
	metodo_pago ENUM ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro') NOT NULL,
	estado_pago ENUM ('Pendiente', 'Pagado', 'Rechazado') DEFAULT 'Pendiente',
	monto_pago DECIMAL(10, 2) NOT NULL,
	fecha_pago DATETIME NULL,
	CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);