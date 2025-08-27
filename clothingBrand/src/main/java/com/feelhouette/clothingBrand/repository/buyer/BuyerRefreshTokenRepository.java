package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.BuyerRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuyerRefreshTokenRepository extends JpaRepository<BuyerRefreshToken, UUID> {
    Optional<BuyerRefreshToken> findByToken(String token);
    void deleteAllByBuyer(Buyer buyer);
}
