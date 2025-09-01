package com.feelhouette.clothingBrand.controller.buyer;

import com.feelhouette.clothingBrand.dto.*;
import com.feelhouette.clothingBrand.dto.buyer.BuyerTokenRefreshRequest;
import com.feelhouette.clothingBrand.service.buyer.BuyerAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/buyer")
public class BuyerAuthController {

    private final BuyerAuthService auth;

    public BuyerAuthController(BuyerAuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/buyer-request-signup")
    public ResponseEntity<Void> requestSignup(@RequestBody @Valid SignupEmailRequest req,
                                              @RequestHeader(value = "X-FRONTEND-BASE-URL", required = false) String frontendBase) {
        var base = frontendBase == null ? "http://localhost:5173" : frontendBase;
        auth.buyerRequestSignup(req, base);
        System.out.println("buyer endpoint hit");
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @GetMapping("/validate-confirmation")
    public ResponseEntity<ValidateConfirmationResponse> validate(@RequestParam("token") String token) {
        var res = auth.validateConfirmationToken(token);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/complete-signup")
    public ResponseEntity<Void> completeSignup(@RequestBody @Valid SignupCompleteRequest req) {
        auth.completeSignup(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest req) {
        var res = auth.login(req);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody @Valid BuyerTokenRefreshRequest req) {
        var res = auth.refreshToken(req);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody BuyerTokenRefreshRequest req) {
        auth.logout(req);
        return ResponseEntity.noContent().build();
    }
}


