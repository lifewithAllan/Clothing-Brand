package com.feelhouette.clothingBrand.dto.buyer;

import java.util.List;

public record CartItemResponseDTO(
        String id,
        Long jerseyId,
        String jerseyName,
        String size,
        String versionSelected,
        String customName,
        String customNumber,
        Integer quantity,
        Double unitPrice,
        Double itemTotal,
        String frontImageUrl,
        String leagueName,
        List<String> badges
) {}

