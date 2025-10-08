package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, UUID> {
//    Optional<Buyer> findByEmail(String email);
//    boolean existsByEmail(String email);

    // More expressive naming
//    Optional<Buyer> findBuyerByEmail(String email);
//    boolean doesBuyerExistByEmail(String email);

    // Using @Query for explicit control (optional, but useful for complex queries)
    @Query("SELECT b FROM Buyer b WHERE b.email = :email")
    Optional<Buyer> fetchByEmail(@Param("email") String email);

    @Query("SELECT COUNT(b) > 0 FROM Buyer b WHERE b.email = :email")
    boolean checkExistenceByEmail(@Param("email") String email);

    // Example implementation for JPA
    @Query("SELECT b FROM Buyer b WHERE b.firstName = :firstName")
    Optional<Buyer> fetchByFirstName(@Param("firstName") String firstName);
}

