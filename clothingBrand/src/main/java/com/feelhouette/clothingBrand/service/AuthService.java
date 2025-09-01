package com.feelhouette.clothingBrand.service;

import com.feelhouette.clothingBrand.dto.*;
import com.feelhouette.clothingBrand.model.*;
import com.feelhouette.clothingBrand.repository.ConfirmationTokenRepository;
import com.feelhouette.clothingBrand.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ConfirmationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       ConfirmationTokenRepository tokenRepository,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.authenticationManager = authenticationManager;
    }

    // Step 1: request signup (email only)
    public void requestSignup(SignupEmailRequest req, String frontendBaseUrl) {
        String email = req.email().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            // Don't leak: respond with success but do nothing (or optionally re-send link)
            return;
        }
        // create token
        String token = UUID.randomUUID().toString();
        var expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);
        var conf = new ConfirmationToken(token, email, expiresAt);
        tokenRepository.save(conf);

        String confirmationLink = frontendBaseUrl + "/signup/complete?token=" + token;
        emailService.sendConfirmationEmail(email, confirmationLink);
        System.out.println("the seller signup request endpoint has been bit successfully");
    }

    public ValidateConfirmationResponse validateConfirmationToken(String token) {
        var optional = tokenRepository.findByToken(token);
        var ct = optional.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));
        if (ct.isUsed()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token already used");
        if (ct.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.GONE, "Token expired");
        return new ValidateConfirmationResponse(ct.getEmail(), ct.getExpiresAt().toEpochMilli());
    }

    public void completeSignup(SignupCompleteRequest req) {
        var token = tokenRepository.findByToken(req.token())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));

        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token invalid or expired");
        }

        String email = token.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // default role ADMIN as requested (but you can change)
        var roles = Set.of(Role.ADMIN);
        var hashed = passwordEncoder.encode(req.password());

        var user = new User(email, hashed, req.firstName(), req.lastName(), roles, true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        var user = userRepository.findByEmail(request.email()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRoles());
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken(), "Bearer", java.time.Instant.now().plusMillis(15*60*1000).toEpochMilli());
    }

    public AuthResponse refreshToken(TokenRefreshRequest req) {
        var rt = refreshTokenService.findByToken(req.refreshToken());
        if (rt == null || rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
        }

        var user = rt.getUser();
        // Optionally rotate refresh token: create new one, revoke old
        refreshTokenService.revoke(rt);
        var newRt = refreshTokenService.createRefreshToken(user);

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRoles());
        return new AuthResponse(accessToken, newRt.getToken(), "Bearer", Instant.now().plusMillis(15*60*1000).toEpochMilli());
    }

    public void logout(TokenRefreshRequest req) {
        var rt = refreshTokenService.findByToken(req.refreshToken());
        if (rt != null) {
            refreshTokenService.revoke(rt);
        }
    }
}

