package com.feelhouette.clothingBrand.controller.buyer;

import com.feelhouette.clothingBrand.service.buyer.ProductBrowseService;
import com.feelhouette.clothingBrand.dto.buyer.ProductResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyer/products")
public class ProductBrowseController {
    private final ProductBrowseService service;

    public ProductBrowseController(ProductBrowseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> listAll(@RequestParam(value = "q", required = false) String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(service.listAll());
        } else {
            return ResponseEntity.ok(service.search(q));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
}
