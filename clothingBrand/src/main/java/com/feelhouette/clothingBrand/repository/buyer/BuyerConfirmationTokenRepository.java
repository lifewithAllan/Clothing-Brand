package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.BuyerConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuyerConfirmationTokenRepository extends JpaRepository<BuyerConfirmationToken, UUID> {
    Optional<BuyerConfirmationToken> findByToken(String token);
}

