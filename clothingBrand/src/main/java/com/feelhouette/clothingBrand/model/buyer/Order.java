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

}

