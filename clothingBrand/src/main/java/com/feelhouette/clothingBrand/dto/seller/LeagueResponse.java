package com.feelhouette.clothingBrand.dto.seller;

import com.feelhouette.clothingBrand.model.seller.FontType;

import java.util.List;

public record LeagueResponse(
        Long id,
        String leagueName,
        FontType fontType,
        List<BadgeResponse> badges
) {}
