package com.feelhouette.clothingBrand.dto.buyer;

import java.util.List;

public record CheckoutDTO(
        String deliveryOption, // PICKUP or SHIPPING
        String county,
        String town,
        String phone,
        List<String> cartItemIds
) {}

