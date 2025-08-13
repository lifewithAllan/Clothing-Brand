package com.feelhouette.clothingBrand.dto;

public record AuthResponse(String accessToken,
                           String refreshToken,
                           String tokenType,
                           long expiresIn) {}
