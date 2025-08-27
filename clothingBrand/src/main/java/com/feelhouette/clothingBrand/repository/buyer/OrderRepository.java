package com.feelhouette.clothingBrand.repository.buyer;

import com.feelhouette.clothingBrand.model.buyer.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {}
