package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.model.buyer.DeleteAccountToken;
import com.feelhouette.clothingBrand.model.buyer.PasswordResetToken;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.repository.buyer.DeleteAccountTokenRepository;
import com.feelhouette.clothingBrand.repository.buyer.PasswordResetTokenRepository;
import com.feelhouette.clothingBrand.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class BuyerAccountService {
    private final BuyerRepository buyerRepo;
    private final PasswordResetTokenRepository resetRepo;
    private final DeleteAccountTokenRepository deleteRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final String frontendBase;

    public BuyerAccountService(BuyerRepository buyerRepo,
                               PasswordResetTokenRepository resetRepo,
                               DeleteAccountTokenRepository deleteRepo,
                               EmailService emailService,
                               PasswordEncoder passwordEncoder,
                               @Value("${app.frontend.base:http://localhost:3000}") String frontendBase) {
        this.buyerRepo = buyerRepo;
        this.resetRepo = resetRepo;
        this.deleteRepo = deleteRepo;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.frontendBase = frontendBase;
    }

    public void requestPasswordReset(String email) {
        var buyer = buyerRepo.fetchByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));
        String token = UUID.randomUUID().toString();
        var expires = Instant.now().plus(2, ChronoUnit.HOURS);
        var prt = new PasswordResetToken(token, buyer, expires);
        resetRepo.save(prt);

        String link = frontendBase + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(buyer.getEmail(), link);
    }

    public void completePasswordReset(String token, String newPassword) {
        var prt = resetRepo.findByToken(token).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));
        if (prt.isUsed() || prt.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token invalid/expired");

        var buyer = prt.getBuyer();
        buyer.setPasswordHash(passwordEncoder.encode(newPassword));
        buyerRepo.save(buyer);

        prt.setUsed(true);
        resetRepo.save(prt);
    }

    public void requestAccountDeletion(String email) {
        var buyer = buyerRepo.fetchByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));
        String token = UUID.randomUUID().toString();
        var expires = Instant.now().plus(24, ChronoUnit.HOURS);
        var dat = new DeleteAccountToken(token, buyer, expires);
        deleteRepo.save(dat);

        String link = frontendBase + "/confirm-delete-account?token=" + token;
        emailService.sendDeleteAccountEmail(buyer.getEmail(), link);
    }

    public void confirmAccountDeletion(String token) {
        var dat = deleteRepo.findByToken(token).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid token"));
        if (dat.isUsed() || dat.getExpiresAt().isBefore(Instant.now())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token invalid/expired");

        Buyer buyer = dat.getBuyer();

        // Delete buyer and cascade will remove cart and orders
        buyerRepo.delete(buyer);

        dat.setUsed(true);
        deleteRepo.save(dat);
    }
}
