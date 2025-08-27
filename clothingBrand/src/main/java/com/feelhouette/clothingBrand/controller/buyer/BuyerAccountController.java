package com.feelhouette.clothingBrand.controller.buyer;

import com.feelhouette.clothingBrand.dto.buyer.DeleteAccountRequest;
import com.feelhouette.clothingBrand.dto.buyer.PasswordResetCompleteRequest;
import com.feelhouette.clothingBrand.dto.buyer.PasswordResetRequest;
import com.feelhouette.clothingBrand.service.buyer.BuyerAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyer/account")
public class BuyerAccountController {
    private final BuyerAccountService service;

    public BuyerAccountController(BuyerAccountService service) {
        this.service = service;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody PasswordResetRequest req) {
        service.requestPasswordReset(req.email());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetCompleteRequest req) {
        service.completePasswordReset(req.token(), req.newPassword());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-delete")
    public ResponseEntity<?> requestDelete(@RequestBody DeleteAccountRequest req) {
        service.requestAccountDeletion(req.email());
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/delete/confirm")
    public ResponseEntity<?> confirmDelete(@RequestParam("token") String token) {
        service.confirmAccountDeletion(token);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Account deleted"));
    }
}

