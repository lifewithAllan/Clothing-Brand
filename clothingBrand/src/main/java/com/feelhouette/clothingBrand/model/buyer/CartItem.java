//package com.feelhouette.clothingBrand.model.buyer;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.Instant;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//@Data
//@Entity
//@Table(name = "cart_items")
//public class CartItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    // Snapshot of jersey id (references seller jersey but we don't set foreign key here to keep decoupled)
//    private Long jerseyId;
//
//    private String jerseyName;
//    private String leagueName;
//    private String kitVersion;
//
//    private String size;
//    private String versionSelected; // player/fan/retro
//    private String customName;
//    private String customNumber;
//
//    private Double unitPrice;      // base or discounted snapshot
//    private Integer quantity = 1;
//
//    private String frontImageUrl;  // snapshot
//    private String sideImageUrl;
//    private String backImageUrl;
//
//    // totalPrice is derived but we can also store snapshot
//    private Double itemTotal;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "buyer_id")
//    private Buyer buyer;
//
//    private Instant createdAt = Instant.now();
//
//    @ElementCollection(fetch = FetchType.EAGER)
//    @CollectionTable(name = "cart_item_badges", joinColumns = @JoinColumn(name = "cart_item_id"))
//    @Column(name = "badge")
//    private List<String> badges = new ArrayList<>();;
//
//    public CartItem() {}
//
////    // Getters and setters
////
////    public UUID getId() { return id; }
////    public Long getJerseyId() { return jerseyId; }
////    public void setJerseyId(Long jerseyId) { this.jerseyId = jerseyId; }
////    public String getJerseyName() { return jerseyName; }
////    public void setJerseyName(String jerseyName) { this.jerseyName = jerseyName; }
////    public String getLeagueName() { return leagueName; }
////    public void setLeagueName(String leagueName) { this.leagueName = leagueName; }
////    public String getKitVersion() { return kitVersion; }
////    public void setKitVersion(String kitVersion) { this.kitVersion = kitVersion; }
////    public String getSize() { return size; }
////    public void setSize(String size) { this.size = size; }
////    public String getVersionSelected() { return versionSelected; }
////    public void setVersionSelected(String versionSelected) { this.versionSelected = versionSelected; }
////    public String getCustomName() { return customName; }
////    public void setCustomName(String customName) { this.customName = customName; }
////    public String getCustomNumber() { return customNumber; }
////    public void setCustomNumber(String customNumber) { this.customNumber = customNumber; }
////    public Double getUnitPrice() { return unitPrice; }
////    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
////    public Integer getQuantity() { return quantity; }
////    public void setQuantity(Integer quantity) { this.quantity = quantity; }
////    public String getFrontImageUrl() { return frontImageUrl; }
////    public void setFrontImageUrl(String frontImageUrl) { this.frontImageUrl = frontImageUrl; }
////    public String getSideImageUrl() { return sideImageUrl; }
////    public void setSideImageUrl(String sideImageUrl) { this.sideImageUrl = sideImageUrl; }
////    public String getBackImageUrl() { return backImageUrl; }
////    public void setBackImageUrl(String backImageUrl) { this.backImageUrl = backImageUrl; }
////    public Double getItemTotal() { return itemTotal; }
////    public void setItemTotal(Double itemTotal) { this.itemTotal = itemTotal; }
////    public Buyer getBuyer() { return buyer; }
////    public void setBuyer(Buyer buyer) { this.buyer = buyer; }
////    public Instant getCreatedAt() { return createdAt; }
//}
//
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
