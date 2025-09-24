package com.feelhouette.clothingBrand.service.seller;

import com.feelhouette.clothingBrand.dto.seller.JerseyRequest;
import com.feelhouette.clothingBrand.dto.seller.JerseyResponse;
import com.feelhouette.clothingBrand.model.seller.Jersey;
import com.feelhouette.clothingBrand.model.seller.League;
import com.feelhouette.clothingBrand.repository.seller.JerseyRepository;
import com.feelhouette.clothingBrand.repository.seller.LeagueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JerseyService {

    private final JerseyRepository jerseyRepo;
    private final LeagueRepository leagueRepo;

//    public JerseyResponse createJersey(JerseyRequest req) {
//        League league = leagueRepo.findById(req.leagueId())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "League not found"));
//
//        Jersey jersey = Jersey.builder()
//                .jerseyName(req.jerseyName())
//                .season(req.season())
//                .kitVersion(req.kitVersion())
//                .league(league)
//                .sizes(req.sizes())
//                .descriptionPoints(req.descriptionPoints())
//                .frontImageUrl(req.frontImageUrl())
//                .sideImageUrl(req.sideImageUrl())
//                .backImageUrl(req.backImageUrl())
//                .basePrice(req.basePrice())
//                .discountedPrice(req.discountedPrice())
//                .build();
//
//        Jersey saved = jerseyRepo.save(jersey);
//        return mapToResponse(saved);
//    }

    public JerseyResponse createJersey(JerseyRequest req) {
        List<League> leagues = leagueRepo.findAllById(req.leagueIds());
        if (leagues.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No valid leagues found");
        }

        Jersey jersey = Jersey.builder()
                .jerseyName(req.jerseyName())
                .season(req.season())
                .kitVersion(req.kitVersion())
                .leagues(leagues)
                .sizes(req.sizes())
                .descriptionPoints(req.descriptionPoints())
                .frontImageUrl(req.frontImageUrl())
                .sideImageUrl(req.sideImageUrl())
                .backImageUrl(req.backImageUrl())
                .basePrice(req.basePrice())
                .discountedPrice(req.discountedPrice())
                .build();

        Jersey saved = jerseyRepo.save(jersey);
        return mapToResponse(saved);
    }

    public List<JerseyResponse> getAll() {
        return jerseyRepo.findAll().stream().map(this::mapToResponse).toList();
    }

    public JerseyResponse updatePriceAndSizes(Long id, Double basePrice, Double discountedPrice, List<String> sizes) {
        Jersey jersey = jerseyRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jersey not found"));
        jersey.setBasePrice(basePrice);
        jersey.setDiscountedPrice(discountedPrice);
        jersey.setSizes(sizes);
        return mapToResponse(jerseyRepo.save(jersey));
    }

    public void delete(Long id) {
        if (!jerseyRepo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Jersey not found");
        jerseyRepo.deleteById(id);
    }

//    private JerseyResponse mapToResponse(Jersey jersey) {
//        return new JerseyResponse(
//                jersey.getId(),
//                jersey.getJerseyName(),
//                jersey.getSeason(),
//                jersey.getKitVersion(),
//                jersey.getLeague().getLeagueName(),
//                jersey.getSizes(),
//                jersey.getDescriptionPoints(),
//                jersey.getFrontImageUrl(),
//                jersey.getSideImageUrl(),
//                jersey.getBackImageUrl(),
//                jersey.getBasePrice(),
//                jersey.getDiscountedPrice()
//        );
//    }

    private JerseyResponse mapToResponse(Jersey jersey) {
        return new JerseyResponse(
                jersey.getId(),
                jersey.getJerseyName(),
                jersey.getSeason(),
                jersey.getKitVersion(),
                jersey.getLeagues().stream()
                        .map(League::getLeagueName)
                        .toList(),
                jersey.getSizes(),
                jersey.getDescriptionPoints(),
                jersey.getFrontImageUrl(),
                jersey.getSideImageUrl(),
                jersey.getBackImageUrl(),
                jersey.getBasePrice(),
                jersey.getDiscountedPrice()
        );
    }
}

