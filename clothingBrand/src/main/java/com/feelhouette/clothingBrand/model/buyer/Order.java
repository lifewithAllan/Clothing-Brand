package com.feelhouette.clothingBrand.model.buyer;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String reference; // e.g. ORDER-UUID or timestamped

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderLine> lines = new ArrayList<>();

    private Double total;
    private String status; // PENDING, PAID, CANCELLED etc.

    @Enumerated(EnumType.STRING)
    private DeliveryOption deliveryOption;

    private String county;
    private String town;
    private String phone;

    private Instant createdAt = Instant.now();

    public Order() {}

//    // getters & setters
//    public UUID getId() { return id; }
//    public String getReference() { return reference; }
//    public void setReference(String reference) { this.reference = reference; }
//    public Buyer getBuyer() { return buyer; }
//    public void setBuyer(Buyer buyer) { this.buyer = buyer; }
//    public List<OrderLine> getLines() { return lines; }
//    public void setLines(List<OrderLine> lines) { this.lines = lines; }
//    public Double getTotal() { return total; }
//    public void setTotal(Double total) { this.total = total; }
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//    public DeliveryOption getDeliveryOption() { return deliveryOption; }
//    public void setDeliveryOption(DeliveryOption deliveryOption) { this.deliveryOption = deliveryOption; }
//    public String getCounty() { return county; }
//    public void setCounty(String county) { this.county = county; }
//    public String getTown() { return town; }
//    public void setTown(String town) { this.town = town; }
//    public String getPhone() { return phone; }
//    public void setPhone(String phone) { this.phone = phone; }
//    public Instant getCreatedAt() { return createdAt; }
}

