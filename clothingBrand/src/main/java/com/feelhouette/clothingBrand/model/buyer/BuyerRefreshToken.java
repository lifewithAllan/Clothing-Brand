package com.feelhouette.clothingBrand.model.buyer;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "BuyerRefresh_tokens")
public class BuyerRefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private Buyer buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id"/*, nullable = false*/)
    private Buyer buyer;

    private Instant expiresAt;
    private boolean revoked = false;
    private Instant createdAt = Instant.now();
    private Instant lastUsedAt;

    public BuyerRefreshToken() {}

    public BuyerRefreshToken(String token, Buyer buyer, Instant expiresAt) {
        this.token = token;
        this.buyer = buyer;
        this.expiresAt = expiresAt;
    }

}


