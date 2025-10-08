package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.service.GenericUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class BuyerUserDetailsService implements UserDetailsService {

    private final GenericUserDetailsService<Buyer> delegate;

    public BuyerUserDetailsService(BuyerRepository buyerRepository) {
        // Pass both lookup functions: first name first, then email as fallback
        this.delegate = new GenericUserDetailsService<>(
                buyerRepository::fetchByEmail,      // Fallback: lookup by email
                buyerRepository::fetchByFirstName   // Primary: lookup by first name
        );
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return delegate.loadUserByUsername(username);
    }
}