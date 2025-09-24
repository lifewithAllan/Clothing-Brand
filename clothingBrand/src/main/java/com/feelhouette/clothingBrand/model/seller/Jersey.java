package com.feelhouette.clothingBrand.model.seller;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Jersey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jerseyName;
    private String season; // e.g. 2025/26
    private String kitVersion; // player/fan/special

//    @ManyToOne
//    @JoinColumn(name = "league_id")
//    private League league;

    @ManyToMany
    @JoinTable(
            name = "jersey_leagues",
            joinColumns = @JoinColumn(name = "jersey_id"),
            inverseJoinColumns = @JoinColumn(name = "league_id")
    )
    private List<League> leagues;

    @ElementCollection
    private List<String> sizes;

    @ElementCollection
    private List<String> descriptionPoints;

    private String frontImageUrl;
    private String sideImageUrl;
    private String backImageUrl;

    private Double basePrice;
    private Double discountedPrice;
}

