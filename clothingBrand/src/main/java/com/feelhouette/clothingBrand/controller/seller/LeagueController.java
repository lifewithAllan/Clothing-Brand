package com.feelhouette.clothingBrand.controller.seller;

import com.feelhouette.clothingBrand.dto.seller.BadgeRequest;
import com.feelhouette.clothingBrand.dto.seller.LeagueRequest;
import com.feelhouette.clothingBrand.dto.seller.LeagueResponse;
import com.feelhouette.clothingBrand.service.seller.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/leagues")
@RequiredArgsConstructor
public class LeagueController {

    private final LeagueService service;

    @PostMapping
    public ResponseEntity<LeagueResponse> create(@RequestBody LeagueRequest req) {
        return ResponseEntity.status(201).body(service.createLeague(req));
    }

    @GetMapping
    public ResponseEntity<List<LeagueResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}/badges")
    public ResponseEntity<LeagueResponse> updateBadges(@PathVariable Long id, @RequestBody List<BadgeRequest> badges) {
        return ResponseEntity.ok(service.updateBadges(id, badges));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

