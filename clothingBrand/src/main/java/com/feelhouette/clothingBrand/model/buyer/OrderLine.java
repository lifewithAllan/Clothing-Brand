package com.feelhouette.clothingBrand.model.buyer;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "order_lines")
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Long jerseyId;
    private String jerseyName;
    private String size;
    private String versionSelected;
    private String customName;
    private String customNumber;
    private Integer quantity;
    private Double unitPrice;
    private Double lineTotal;

    public OrderLine() {}

}

