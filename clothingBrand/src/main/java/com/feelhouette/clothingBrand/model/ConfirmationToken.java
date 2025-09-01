package com.feelhouette.clothingBrand.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

//@Data
//@Entity
//@Table(name = "confirmation_tokens")
//public class ConfirmationToken {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @Column(nullable = false, unique = true)
//    private String token;
//
//    @Column(nullable = false)
//    private String email;
//
//    private Instant expiresAt;
//    private boolean used = false;
//    private Instant createdAt = Instant.now();
//
//    public ConfirmationToken() {}
//
//    public ConfirmationToken(String token, String email, Instant expiresAt) {
//        this.token = token;
//        this.email = email;
//        this.expiresAt = expiresAt;
//    }
//
//}

@Entity
@Table(name = "confirmation_tokens")
public class ConfirmationToken extends AbstractConfirmationToken {
    // No need to duplicate fields. They are inherited.
    // Buyer-specific fields could be added here if ever needed.

    public ConfirmationToken(String token, String email, Instant expiresAt) {
        this.setToken(token);
        this.setEmail(email);
        this.setExpiresAt(expiresAt);
    }
}

