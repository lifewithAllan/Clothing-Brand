package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class BuyerUserDetailsService implements UserDetailsService {

    private final BuyerRepository buyerRepository;

    public BuyerUserDetailsService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return buyerRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + "not found"));
    }
}


