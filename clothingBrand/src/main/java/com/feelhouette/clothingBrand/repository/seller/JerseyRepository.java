package com.feelhouette.clothingBrand.repository.seller;

import com.feelhouette.clothingBrand.model.seller.Jersey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JerseyRepository extends JpaRepository<Jersey, Long> {
}
