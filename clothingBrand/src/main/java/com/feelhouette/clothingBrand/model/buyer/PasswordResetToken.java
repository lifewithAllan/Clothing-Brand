package com.feelhouette.clothingBrand.model.buyer;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "buyer_password_reset_tokens")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    private Instant expiresAt;
    private boolean used = false;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, Buyer buyer, Instant expiresAt) {
        this.token = token;
        this.buyer = buyer;
        this.expiresAt = expiresAt;
    }

//    // getters & setters
//    public UUID getId() { return id; }
//    public String getToken() { return token; }
//    public Buyer getBuyer() { return buyer; }
//    public Instant getExpiresAt() { return expiresAt; }
//    public boolean isUsed() { return used; }
//    public void setUsed(boolean used) { this.used = used; }
}

