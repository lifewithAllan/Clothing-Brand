package com.feelhouette.clothingBrand.service.seller;

import com.feelhouette.clothingBrand.dto.seller.BadgeResponse;
import com.feelhouette.clothingBrand.dto.seller.BadgeRequest;
import com.feelhouette.clothingBrand.dto.seller.LeagueRequest;
import com.feelhouette.clothingBrand.dto.seller.LeagueResponse;
import com.feelhouette.clothingBrand.model.seller.Badge;
import com.feelhouette.clothingBrand.model.seller.League;
import com.feelhouette.clothingBrand.repository.seller.LeagueRepository;
import com.feelhouette.clothingBrand.repository.seller.BadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeagueService {

    private final LeagueRepository leagueRepo;
    private final BadgeRepository badgeRepo;

    public LeagueResponse createLeague(LeagueRequest req) {
        League league = League.builder()
                .leagueName(req.leagueName())
                .fontType(req.fontType())
                .build();

        List<Badge> badges = req.badges().stream()
                .map(b -> Badge.builder().badgeName(b.badgeName()).league(league).build())
                .toList();

        league.setBadges(badges);

        League saved = leagueRepo.save(league);

        return mapToResponse(saved);
    }

    public List<LeagueResponse> getAll() {
        return leagueRepo.findAll().stream().map(this::mapToResponse).toList();
    }

    public LeagueResponse updateBadges(Long leagueId, List<BadgeRequest> badgesReq) {
        League league = leagueRepo.findById(leagueId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "League not found"));

        league.getBadges().clear();

        List<Badge> badges = badgesReq.stream()
                .map(b -> Badge.builder().badgeName(b.badgeName()).league(league).build())
                .toList();

        league.getBadges().addAll(badges);

        return mapToResponse(leagueRepo.save(league));
    }

    public void delete(Long id) {
        if (!leagueRepo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "League not found");
        leagueRepo.deleteById(id);
    }

    private LeagueResponse mapToResponse(League league) {
        List<BadgeResponse> badgeResponses = league.getBadges().stream()
                .map(b -> new BadgeResponse(b.getId(), b.getBadgeName()))
                .toList();

        return new LeagueResponse(
                league.getId(),
                league.getLeagueName(),
                league.getFontType(),
                badgeResponses
        );
    }
}
