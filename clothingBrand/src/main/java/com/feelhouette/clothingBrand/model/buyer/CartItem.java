package com.feelhouette.clothingBrand.model.buyer;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Snapshot of jersey id (references seller jersey but we don't set foreign key here to keep decoupled)
    private Long jerseyId;

    private String jerseyName;
    private String leagueName;
    private String kitVersion;

    private String size;
    private String versionSelected; // player/fan/retro
    private String customName;
    private String customNumber;

    private Double unitPrice;      // base or discounted snapshot
    private Integer quantity = 1;

    private String frontImageUrl;  // snapshot
    private String sideImageUrl;
    private String backImageUrl;

    // totalPrice is derived but we also store snapshot
    private Double itemTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    private Instant createdAt = Instant.now();

    /**
     * ✅ Persist badges in a separate join table
     * Each selected badge is stored as a row in "cart_item_badges".
     * This way, when you add badges in the frontend, they get saved and reloaded.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "cart_item_badges",
            joinColumns = @JoinColumn(name = "cart_item_id")
    )
    @Column(name = "badge")
    private List<String> badges = new ArrayList<>();

    public CartItem() {}
}
