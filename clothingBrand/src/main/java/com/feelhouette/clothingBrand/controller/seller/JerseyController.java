package com.feelhouette.clothingBrand.controller.seller;

import com.feelhouette.clothingBrand.dto.seller.JerseyRequest;
import com.feelhouette.clothingBrand.dto.seller.JerseyResponse;
import com.feelhouette.clothingBrand.service.seller.JerseyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/jerseys")
@RequiredArgsConstructor
public class JerseyController {

    private final JerseyService service;

    @PostMapping
    public ResponseEntity<JerseyResponse> create(@RequestBody JerseyRequest req) {
        return ResponseEntity.status(201).body(service.createJersey(req));
    }

    @GetMapping
    public ResponseEntity<List<JerseyResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JerseyResponse> update(@PathVariable Long id,
                                                 @RequestParam Double basePrice,
                                                 @RequestParam(required = false) Double discountedPrice,
                                                 @RequestParam List<String> sizes) {
        return ResponseEntity.ok(service.updatePriceAndSizes(id, basePrice, discountedPrice, sizes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

