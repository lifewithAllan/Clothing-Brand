package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.dto.*;
import com.feelhouette.clothingBrand.dto.buyer.BuyerTokenRefreshRequest;
import com.feelhouette.clothingBrand.model.Role;
import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.BuyerConfirmationToken;
import com.feelhouette.clothingBrand.repository.buyer.BuyerConfirmationTokenRepository;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.service.EmailService;
import com.feelhouette.clothingBrand.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

@Service
public class BuyerAuthService {
    private final BuyerRepository buyerRepository;
    private final BuyerConfirmationTokenRepository buyerConfirmationTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BuyerRefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    public BuyerAuthService(BuyerRepository buyerRepository, BuyerConfirmationTokenRepository buyerConfirmationTokenRepository, EmailService emailService, PasswordEncoder passwordEncoder, JwtService jwtService, BuyerRefreshTokenService refreshTokenService, AuthenticationManager authenticationManager) {
        this.buyerRepository = buyerRepository;
        this.buyerConfirmationTokenRepository = buyerConfirmationTokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.authenticationManager = authenticationManager;
    }

    // Step 1: request signup (email only)
    public void buyerRequestSignup(SignupEmailRequest req, String frontendBaseUrl) {
        String email = req.email().toLowerCase().trim();
        if (buyerRepository.checkExistenceByEmail(email)) {
            // Don't leak: respond with success but do nothing (or optionally re-send link)
            return;
        }
        // create token
        String token = UUID.randomUUID().toString();
        var expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);
        var conf = new BuyerConfirmationToken(token, email, expiresAt);
        System.out.println(conf);
        buyerConfirmationTokenRepository.save(conf);

        String confirmationLink = frontendBaseUrl + "/signup/complete?token=" + token;
        emailService.sendConfirmationEmail(email, confirmationLink);
        System.out.println("buyer request signup endpoint has been bit successfully");
    }

    public ValidateConfirmationResponse validateConfirmationToken(String token) {
        var optional = buyerConfirmationTokenRepository.findByToken(token);
        var ct = optional.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));
        if (ct.isUsed()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token already used");
        if (ct.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.GONE, "Token expired");
        return new ValidateConfirmationResponse(ct.getEmail(), ct.getExpiresAt().toEpochMilli());
    }

    public void completeSignup(SignupCompleteRequest req) {
        var token = buyerConfirmationTokenRepository.findByToken(req.token())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token invalid or expired");
        }

        String email = token.getEmail().toLowerCase().trim();
        if (buyerRepository.checkExistenceByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // default role ADMIN as requested (but you can change)
        var roles = Set.of(Role.BUYER);
        var hashed = passwordEncoder.encode(req.password());

        var buyer = new Buyer(email, hashed, req.firstName(), req.lastName(), roles, true);
        buyerRepository.save(buyer);

        token.setUsed(true);
        buyerConfirmationTokenRepository.save(token);
    }

    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        var user = buyerRepository.fetchByEmail(request.email()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRoles());
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken(), "Bearer", java.time.Instant.now().plusMillis(15*60*1000).toEpochMilli());
    }

    public AuthResponse refreshToken(BuyerTokenRefreshRequest req) {
        var rt = refreshTokenService.findByToken(req.buyerRefreshToken());
        if (rt == null || rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
        }

        var user = rt.getBuyer();
        // Optionally rotate refresh token: create new one, revoke old
        refreshTokenService.revoke(rt);
        var newRt = refreshTokenService.createRefreshToken(user);

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRoles());
        return new AuthResponse(accessToken, newRt.getToken(), "Bearer", Instant.now().plusMillis(15*60*1000).toEpochMilli());
    }

    public void logout(BuyerTokenRefreshRequest req) {
        var rt = refreshTokenService.findByToken(req.buyerRefreshToken());
        if (rt != null) {
            refreshTokenService.revoke(rt);
        }
    }
}

