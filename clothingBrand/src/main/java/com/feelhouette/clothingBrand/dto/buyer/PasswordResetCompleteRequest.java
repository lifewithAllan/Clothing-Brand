package com.feelhouette.clothingBrand.dto.buyer;

public record PasswordResetCompleteRequest(String token,
                                           String newPassword) {}

