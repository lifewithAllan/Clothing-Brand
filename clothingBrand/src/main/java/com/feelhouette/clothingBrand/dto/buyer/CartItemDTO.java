package com.feelhouette.clothingBrand.dto.buyer;

import java.util.List;

public record CartItemDTO(
        String cartItemId, // UUID as string, optional on creation
        Long jerseyId,
        String size,
        String versionSelected,
        String customName,
        String customNumber,
        Integer quantity,
        String leagueName,
        List<String> badges
) {}

