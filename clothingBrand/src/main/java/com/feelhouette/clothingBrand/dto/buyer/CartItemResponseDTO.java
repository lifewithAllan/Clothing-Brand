package com.feelhouette.clothingBrand.dto.buyer;

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
        String frontImageUrl
) {}

