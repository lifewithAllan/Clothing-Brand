package com.feelhouette.clothingBrand.dto.seller;

import java.util.List;

public record JerseyResponse(
        Long id,
        String jerseyName,
        String season,
        String kitVersion,
        String leagueName,
        List<String> sizes,
        List<String> descriptionPoints,
        String frontImageUrl,
        String sideImageUrl,
        String backImageUrl,
        Double basePrice,
        Double discountedPrice
) {}
