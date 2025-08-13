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

//    // getters & setters omitted for brevity - implement as needed
//    public UUID getId() { return id; }
//    public String getToken() { return token; }
//    public String getEmail() { return email; }
//    public Instant getExpiresAt() { return expiresAt; }
//    public boolean isUsed() { return used; }
//    public void setUsed(boolean used) { this.used = used; }
}

