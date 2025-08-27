package com.feelhouette.clothingBrand.dto.buyer;

public record CartItemDTO(
        String cartItemId, // UUID as string, optional on creation
        Long jerseyId,
        String size,
        String versionSelected,
        String customName,
        String customNumber,
        Integer quantity
) {}

