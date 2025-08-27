package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.DeleteAccountToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeleteAccountTokenRepository extends JpaRepository<DeleteAccountToken, UUID> {
    Optional<DeleteAccountToken> findByToken(String token);
}
