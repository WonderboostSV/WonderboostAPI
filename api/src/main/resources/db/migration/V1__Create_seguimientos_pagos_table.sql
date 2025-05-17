CREATE TABLE seguimientos_pagos (
	id_seguimiento_pago CHAR(36) NOT NULL PRIMARY KEY,
	id_pago CHAR(36) NOT NULL,
	estado_pago ENUM (
		'En proceso',
		'Completado',
		'Fallido',
		'Reembolsado'
	) NOT NULL,
	observaciones TEXT NULL,
	CONSTRAINT fk_seguimiento_pago FOREIGN KEY (id_pago) REFERENCES pagos (id_pago),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    deleted_at DATETIME NULL
);