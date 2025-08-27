package com.feelhouette.clothingBrand.dto.buyer;

import java.util.List;

public record OrderResponseDTO(
        String orderId,
        String reference,
        List<CartItemResponseDTO> lines,
        Double total,
        String status
) {}

