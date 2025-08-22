package com.feelhouette.clothingBrand.repository.seller;

import com.feelhouette.clothingBrand.model.seller.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
}
