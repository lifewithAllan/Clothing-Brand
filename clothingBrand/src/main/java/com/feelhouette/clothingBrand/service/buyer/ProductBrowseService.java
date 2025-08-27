package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.dto.buyer.ProductResponseDTO;
import com.feelhouette.clothingBrand.model.seller.Jersey;
import com.feelhouette.clothingBrand.repository.seller.JerseyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductBrowseService {
    private final JerseyRepository jerseyRepo;

    public ProductBrowseService(JerseyRepository jerseyRepo) {
        this.jerseyRepo = jerseyRepo;
    }

    public List<ProductResponseDTO> listAll() {
        return jerseyRepo.findAll().stream().map(this::map).collect(Collectors.toList());
    }

    public ProductResponseDTO getById(Long id) {
        Jersey j = jerseyRepo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Product not found"));
        return map(j);
    }

    // simple search implementation across a few fields
    public List<ProductResponseDTO> search(String q) {
        String lower = q == null ? "" : q.toLowerCase();
        return jerseyRepo.findAll().stream()
                .filter(j -> List.of(j.getJerseyName(), j.getSeason(), j.getKitVersion(), j.getLeague() != null ? j.getLeague().getLeagueName() : "")
                        .stream()
                        .anyMatch(f -> f != null && f.toLowerCase().contains(lower)))
                .map(this::map)
                .collect(Collectors.toList());
    }

    private ProductResponseDTO map(Jersey j) {
        return new ProductResponseDTO(
                j.getId(),
                j.getJerseyName(),
                j.getSeason(),
                j.getKitVersion(),
                j.getLeague() != null ? j.getLeague().getLeagueName() : null,
                j.getSizes(),
                j.getDescriptionPoints(),
                j.getFrontImageUrl(),
                j.getSideImageUrl(),
                j.getBackImageUrl(),
                j.getBasePrice(),
                j.getDiscountedPrice()
        );
    }
}

