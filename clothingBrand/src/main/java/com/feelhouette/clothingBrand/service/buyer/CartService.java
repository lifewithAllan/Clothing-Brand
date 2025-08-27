package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.dto.buyer.CartItemDTO;
import com.feelhouette.clothingBrand.dto.buyer.CartItemResponseDTO;
import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.CartItem;
import com.feelhouette.clothingBrand.repository.buyer.CartItemRepository;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.repository.seller.JerseyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartItemRepository cartRepo;
    private final BuyerRepository buyerRepo;
    private final JerseyRepository jerseyRepo;

    public CartService(CartItemRepository cartRepo, BuyerRepository buyerRepo, JerseyRepository jerseyRepo) {
        this.cartRepo = cartRepo;
        this.buyerRepo = buyerRepo;
        this.jerseyRepo = jerseyRepo;
    }

    private Buyer findBuyerByEmail(String email) {
        return buyerRepo.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));
    }

    // Add to cart
    public CartItemResponseDTO addToCart(String buyerEmail, CartItemDTO dto) {
        Buyer buyer = findBuyerByEmail(buyerEmail);

        var jersey = jerseyRepo.findById(dto.jerseyId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jersey not found"));

        double unitPrice = jersey.getDiscountedPrice() != null ? jersey.getDiscountedPrice() : jersey.getBasePrice();

        CartItem item = new CartItem();
        item.setBuyer(buyer);
        item.setJerseyId(dto.jerseyId());
        item.setJerseyName(jersey.getJerseyName());
        item.setLeagueName(jersey.getLeague() != null ? jersey.getLeague().getLeagueName() : null);
        item.setKitVersion(jersey.getKitVersion());
        item.setSize(dto.size());
        item.setVersionSelected(dto.versionSelected());
        item.setCustomName(dto.customName());
        item.setCustomNumber(dto.customNumber());
        item.setUnitPrice(unitPrice);
        item.setQuantity(dto.quantity() == null ? 1 : dto.quantity());
        item.setFrontImageUrl(jersey.getFrontImageUrl());
        item.setSideImageUrl(jersey.getSideImageUrl());
        item.setBackImageUrl(jersey.getBackImageUrl());

        // item total calculation: (unitPrice * qty) + custom print (handled here as fixed cost, or omitted if frontend handles)
        double customPrint = (item.getCustomName() != null && !item.getCustomName().isBlank()) || (item.getCustomNumber() != null && !item.getCustomNumber().isBlank()) ? 300.0 : 0.0;
        // NOTE: badge price is client-side; backend doesn't add it
        double total = item.getUnitPrice() * item.getQuantity() + customPrint;
        item.setItemTotal(total);

        CartItem saved = cartRepo.save(item);
        return map(saved);
    }

    public List<CartItemResponseDTO> listCart(String buyerEmail) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        return cartRepo.findAllByBuyer(buyer).stream().map(this::map).collect(Collectors.toList());
    }

    public CartItemResponseDTO updateItem(String buyerEmail, UUID cartItemId, CartItemDTO dto) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        var item = cartRepo.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!item.getBuyer().getId().equals(buyer.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");

        if (dto.size() != null) item.setSize(dto.size());
        if (dto.quantity() != null) item.setQuantity(dto.quantity());
        if (dto.customName() != null) item.setCustomName(dto.customName());
        if (dto.customNumber() != null) item.setCustomNumber(dto.customNumber());
        if (dto.versionSelected() != null) item.setVersionSelected(dto.versionSelected());

        // recalc
        double customPrint = (item.getCustomName() != null && !item.getCustomName().isBlank()) || (item.getCustomNumber() != null && !item.getCustomNumber().isBlank()) ? 300.0 : 0.0;
        item.setItemTotal(item.getUnitPrice() * item.getQuantity() + customPrint);

        CartItem saved = cartRepo.save(item);
        return map(saved);
    }

    public void removeItem(String buyerEmail, UUID cartItemId) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        var item = cartRepo.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!item.getBuyer().getId().equals(buyer.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        cartRepo.delete(item);
    }

    public void clearCart(String buyerEmail) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        cartRepo.deleteAllByBuyer(buyer);
    }

    private CartItemResponseDTO map(CartItem i) {
        return new CartItemResponseDTO(
                i.getId().toString(),
                i.getJerseyId(),
                i.getJerseyName(),
                i.getSize(),
                i.getVersionSelected(),
                i.getCustomName(),
                i.getCustomNumber(),
                i.getQuantity(),
                i.getUnitPrice(),
                i.getItemTotal(),
                i.getFrontImageUrl()
        );
    }
}

