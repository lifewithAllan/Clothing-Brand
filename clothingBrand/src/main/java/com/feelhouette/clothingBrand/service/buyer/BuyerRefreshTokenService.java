package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.BuyerRefreshToken;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class BuyerRefreshTokenService {
    private final BuyerRefreshTokenRepository repo;
    private final long refreshTokenMillis;

    public BuyerRefreshTokenService(BuyerRefreshTokenRepository repo, long refreshTokenMillis) {
        this.repo = repo;
        this.refreshTokenMillis = refreshTokenMillis;
    }

    public BuyerRefreshToken createRefreshToken(Buyer buyer) {
        String token = UUID.randomUUID().toString() + "-" + UUID.randomUUID();
        BuyerRefreshToken rt = new BuyerRefreshToken(token, buyer, Instant.now().plusMillis(refreshTokenMillis));
        return repo.save(rt);
    }

    public BuyerRefreshToken findByToken(String token) {
        return repo.findByToken(token).orElse(null);
    }

    public void revoke(BuyerRefreshToken token) {
        token.setRevoked(true);
        repo.save(token);
    }

    public void revokeAllForUser(Buyer buyer) {
        repo.deleteAllByBuyer(buyer);
    }
}


