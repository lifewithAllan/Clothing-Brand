package com.feelhouette.clothingBrand.controller.buyer;

import com.feelhouette.clothingBrand.dto.buyer.CheckoutDTO;
import com.feelhouette.clothingBrand.service.buyer.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyer/checkout")
public class CheckoutController {
    private final CheckoutService service;

    public CheckoutController(CheckoutService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails principal, @RequestBody CheckoutDTO dto) {
        var reference = service.checkout(principal.getUsername(), dto);
        return ResponseEntity.ok().body(java.util.Map.of("reference", reference, "status", "PENDING"));
    }
}

