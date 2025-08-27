package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.CartItem;
import com.feelhouette.clothingBrand.model.buyer.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findAllByBuyer(Buyer buyer);
    void deleteAllByBuyer(Buyer buyer);
}

