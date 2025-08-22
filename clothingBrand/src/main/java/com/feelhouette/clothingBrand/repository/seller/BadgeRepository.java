package com.feelhouette.clothingBrand.repository.seller;

import com.feelhouette.clothingBrand.model.seller.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
}
