package com.feelhouette.clothingBrand.controller.buyer;

import com.feelhouette.clothingBrand.dto.buyer.CartItemDTO;
import com.feelhouette.clothingBrand.dto.buyer.CartItemResponseDTO;
import com.feelhouette.clothingBrand.service.buyer.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/buyer/cart")
public class CartController {
    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    // buyerEmail is obtained from authenticated principal
    private String principalEmail(UserDetails principal) {
        return principal.getUsername();
    }

    @PostMapping
    public ResponseEntity<CartItemResponseDTO> add(@AuthenticationPrincipal UserDetails principal, @RequestBody CartItemDTO dto) {
        var res = service.addToCart(principalEmail(principal), dto);
        return ResponseEntity.status(201).body(res);
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> list(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.listCart(principalEmail(principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemResponseDTO> update(@AuthenticationPrincipal UserDetails principal, @PathVariable UUID id, @RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(service.updateItem(principalEmail(principal), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable UUID id) {
        service.removeItem(principalEmail(principal), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(@AuthenticationPrincipal UserDetails principal) {
        service.clearCart(principalEmail(principal));
        return ResponseEntity.noContent().build();
    }
}
