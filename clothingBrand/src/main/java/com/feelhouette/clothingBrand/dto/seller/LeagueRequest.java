package com.feelhouette.clothingBrand.dto.seller;

import com.feelhouette.clothingBrand.model.seller.FontType;

import java.util.List;

public record LeagueRequest(
        String leagueName,
        FontType fontType,
        List<BadgeRequest> badges
) {}
