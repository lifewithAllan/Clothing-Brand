package com.feelhouette.clothingBrand.dto.buyer;

import java.util.List;

public record ProductResponseDTO(
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

