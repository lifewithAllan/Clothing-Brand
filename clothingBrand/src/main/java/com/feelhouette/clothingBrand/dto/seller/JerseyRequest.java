package com.feelhouette.clothingBrand.dto.seller;

import java.util.List;

public record JerseyRequest(
        String jerseyName,
        String season,
        String kitVersion,
        List<Long> leagueIds,
        List<String> sizes,
        List<String> descriptionPoints,
        String frontImageUrl,
        String sideImageUrl,
        String backImageUrl,
        Double basePrice,
        Double discountedPrice
) {}
