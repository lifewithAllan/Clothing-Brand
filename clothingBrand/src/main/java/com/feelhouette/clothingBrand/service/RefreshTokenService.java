package com.feelhouette.clothingBrand.service;

import com.feelhouette.clothingBrand.model.RefreshToken;
import com.feelhouette.clothingBrand.model.User;
import com.feelhouette.clothingBrand.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repo;
    private final long refreshTokenMillis;

    public RefreshTokenService(RefreshTokenRepository repo,
                               @Value("${jwt.refreshTokenExpirationDays}") long refreshTokenDays) {
        this.repo = repo;
        this.refreshTokenMillis = refreshTokenDays * 24L * 60L * 60L * 1000L;
    }

    public RefreshToken createRefreshToken(User user) {
        String token = UUID.randomUUID().toString() + "-" + UUID.randomUUID();
        RefreshToken rt = new RefreshToken(token, user, Instant.now().plusMillis(refreshTokenMillis));
        return repo.save(rt);
    }

    public RefreshToken findByToken(String token) {
        return repo.findByToken(token).orElse(null);
    }

    public void revoke(RefreshToken token) {
        token.setRevoked(true);
        repo.save(token);
    }

    public void revokeAllForUser(User user) {
        repo.deleteAllByUser(user);
    }
}

