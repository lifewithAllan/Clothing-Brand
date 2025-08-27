package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.dto.buyer.CheckoutDTO;
import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.DeliveryOption;
import com.feelhouette.clothingBrand.model.buyer.Order;
import com.feelhouette.clothingBrand.model.buyer.OrderLine;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.repository.buyer.CartItemRepository;
import com.feelhouette.clothingBrand.repository.buyer.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CheckoutService {
    private final CartItemRepository cartRepo;
    private final BuyerRepository buyerRepo;
    private final OrderRepository orderRepo;

    public CheckoutService(CartItemRepository cartRepo, BuyerRepository buyerRepo, OrderRepository orderRepo) {
        this.cartRepo = cartRepo;
        this.buyerRepo = buyerRepo;
        this.orderRepo = orderRepo;
    }

    private Buyer findBuyer(String email) {
        return buyerRepo.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));
    }

    public String checkout(String buyerEmail, CheckoutDTO dto) {
        Buyer buyer = findBuyer(buyerEmail);
        var items = cartRepo.findAllByBuyer(buyer);
        if (items.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");

        Order order = new Order();
        order.setBuyer(buyer);
        order.setReference("ORD-" + UUID.randomUUID());
        order.setStatus("PENDING");
        order.setCreatedAt(Instant.now());

        if ("SHIPPING".equalsIgnoreCase(dto.deliveryOption())) {
            order.setDeliveryOption(DeliveryOption.SHIPPING);
            order.setCounty(dto.county());
            order.setTown(dto.town());
            order.setPhone(dto.phone());
        } else {
            order.setDeliveryOption(DeliveryOption.PICKUP);
        }

        final double[] total = {0.0};
        List<OrderLine> lines = items.stream().map(ci -> {
            OrderLine ol = new OrderLine();
            ol.setJerseyId(ci.getJerseyId());
            ol.setJerseyName(ci.getJerseyName());
            ol.setSize(ci.getSize());
            ol.setVersionSelected(ci.getVersionSelected());
            ol.setCustomName(ci.getCustomName());
            ol.setCustomNumber(ci.getCustomNumber());
            ol.setQuantity(ci.getQuantity());
            ol.setUnitPrice(ci.getUnitPrice());
            double lineTotal = ci.getItemTotal();
            ol.setLineTotal(lineTotal);
            total[0] += lineTotal;
            return ol;
        }).collect(Collectors.toList());

        order.setLines(lines);
        order.setTotal(total[0]);

        Order saved = orderRepo.save(order);

        // clear buyer cart
        cartRepo.deleteAllByBuyer(buyer);

        // We simulate payment; status remains PENDING
        return saved.getReference();
    }
}

