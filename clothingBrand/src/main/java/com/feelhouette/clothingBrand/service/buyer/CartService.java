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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartService {

    private static final Logger log = LoggerFactory.getLogger(CartService.class);

    private final CartItemRepository cartRepo;
    private final BuyerRepository buyerRepo;
    private final JerseyRepository jerseyRepo;

    public CartService(CartItemRepository cartRepo, BuyerRepository buyerRepo, JerseyRepository jerseyRepo) {
        this.cartRepo = cartRepo;
        this.buyerRepo = buyerRepo;
        this.jerseyRepo = jerseyRepo;
    }

    private Buyer findBuyerByEmail(String email) {
        return buyerRepo.fetchByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));
    }

    // Add to cart
    public CartItemResponseDTO addToCart(String buyerEmail, CartItemDTO dto) {
        log.info("Saving cart with league: {}, badges: {}", dto.leagueName(), dto.badges());
        Buyer buyer = findBuyerByEmail(buyerEmail);

        var jersey = jerseyRepo.findById(dto.jerseyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jersey not found"));

        double unitPrice = jersey.getDiscountedPrice() != null
                ? jersey.getDiscountedPrice()
                : jersey.getBasePrice();

        CartItem item = new CartItem();
        item.setBuyer(buyer);
        item.setJerseyId(dto.jerseyId());
        item.setJerseyName(jersey.getJerseyName());
        item.setKitVersion(jersey.getKitVersion());
        item.setLeagueName(dto.leagueName()); // ✅ use buyer’s selected league
        item.setSize(dto.size());
        item.setVersionSelected(dto.versionSelected());
        item.setCustomName(dto.customName());
        item.setCustomNumber(dto.customNumber());
        item.setUnitPrice(unitPrice);
        item.setQuantity(dto.quantity() == null ? 1 : dto.quantity());
        item.setFrontImageUrl(jersey.getFrontImageUrl());
        item.setSideImageUrl(jersey.getSideImageUrl());
        item.setBackImageUrl(jersey.getBackImageUrl());
        item.setBadges(dto.badges());

        // Calculate item total
        double customPrint = (item.getCustomName() != null && !item.getCustomName().isBlank())
                || (item.getCustomNumber() != null && !item.getCustomNumber().isBlank())
                ? 300.0 : 0.0;
        double total = item.getUnitPrice() * item.getQuantity() + customPrint;
        item.setItemTotal(total);

        CartItem saved = cartRepo.save(item);
        log.info("Saved item with league: {}, badges: {}", saved.getLeagueName(), saved.getBadges());
        return map(saved);
    }

    public List<CartItemResponseDTO> listCart(String buyerEmail) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        return cartRepo.findAllByBuyer(buyer).stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    public CartItemResponseDTO updateItem(String buyerEmail, UUID cartItemId, CartItemDTO dto) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        var item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!item.getBuyer().getId().equals(buyer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        }

        if (dto.size() != null) item.setSize(dto.size());
        if (dto.quantity() != null) item.setQuantity(dto.quantity());
        if (dto.customName() != null) item.setCustomName(dto.customName());
        if (dto.customNumber() != null) item.setCustomNumber(dto.customNumber());
        if (dto.versionSelected() != null) item.setVersionSelected(dto.versionSelected());
        if (dto.badges() != null) item.setBadges(dto.badges());
        if (dto.leagueName() != null) item.setLeagueName(dto.leagueName()); // ✅ allow update

        log.info("Updating cart item {} with league: {}, badges: {}", cartItemId, dto.leagueName(), dto.badges());

        // Recalculate total
        double customPrint = (item.getCustomName() != null && !item.getCustomName().isBlank())
                || (item.getCustomNumber() != null && !item.getCustomNumber().isBlank())
                ? 300.0 : 0.0;
        item.setItemTotal(item.getUnitPrice() * item.getQuantity() + customPrint);

        CartItem saved = cartRepo.save(item);
        return map(saved);
    }

    public void removeItem(String buyerEmail, UUID cartItemId) {
        Buyer buyer = findBuyerByEmail(buyerEmail);
        var item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!item.getBuyer().getId().equals(buyer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        }
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
                i.getFrontImageUrl(),
                i.getLeagueName(), // ✅ map league
                i.getBadges()
        );
    }
}
