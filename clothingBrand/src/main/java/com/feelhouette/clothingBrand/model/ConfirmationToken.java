package com.feelhouette.clothingBrand.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "confirmation_tokens")
public class ConfirmationToken {
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

    public ConfirmationToken() {}

    public ConfirmationToken(String token, String email, Instant expiresAt) {
        this.token = token;
        this.email = email;
        this.expiresAt = expiresAt;
    }
    
}

