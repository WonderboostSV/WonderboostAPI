package com.api.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
// @EntityListeners(EntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", 
            updatable = false, 
            nullable = false, 
            length = 36)
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", 
            nullable = false, 
            updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Método para borrado lógico mejorado
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    // Método para verificar estado
    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}