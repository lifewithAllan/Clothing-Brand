package com.feelhouette.clothingBrand.repository;

import com.feelhouette.clothingBrand.model.RefreshToken;
import com.feelhouette.clothingBrand.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser(User user);
}

