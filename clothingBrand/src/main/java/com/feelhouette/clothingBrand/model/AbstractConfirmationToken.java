package com.feelhouette.clothingBrand.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass // This is key! It means the base class is not an entity itself.
@Data
public abstract class AbstractConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    private Instant expiresAt;
    private boolean used = false;
    private Instant createdAt = Instant.now();

    // Constructors, etc...
}
