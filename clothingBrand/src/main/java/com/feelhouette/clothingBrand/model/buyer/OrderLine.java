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

//    // getters & setters
//    public UUID getId() { return id; }
//    public Long getJerseyId() { return jerseyId; }
//    public void setJerseyId(Long jerseyId) { this.jerseyId = jerseyId; }
//    public String getJerseyName() { return jerseyName; }
//    public void setJerseyName(String jerseyName) { this.jerseyName = jerseyName; }
//    public String getSize() { return size; }
//    public void setSize(String size) { this.size = size; }
//    public String getVersionSelected() { return versionSelected; }
//    public void setVersionSelected(String versionSelected) { this.versionSelected = versionSelected; }
//    public String getCustomName() { return customName; }
//    public void setCustomName(String customName) { this.customName = customName; }
//    public String getCustomNumber() { return customNumber; }
//    public void setCustomNumber(String customNumber) { this.customNumber = customNumber; }
//    public Integer getQuantity() { return quantity; }
//    public void setQuantity(Integer quantity) { this.quantity = quantity; }
//    public Double getUnitPrice() { return unitPrice; }
//    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
//    public Double getLineTotal() { return lineTotal; }
//    public void setLineTotal(Double lineTotal) { this.lineTotal = lineTotal; }
}

