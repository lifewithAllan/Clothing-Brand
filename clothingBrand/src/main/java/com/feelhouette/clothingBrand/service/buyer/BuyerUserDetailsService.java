package com.feelhouette.clothingBrand.service.buyer;

import com.feelhouette.clothingBrand.model.buyer.Buyer;
import com.feelhouette.clothingBrand.repository.buyer.BuyerRepository;
import com.feelhouette.clothingBrand.service.GenericUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//@Service
//public class BuyerUserDetailsService implements UserDetailsService {
//
//    private final BuyerRepository buyerRepository;
//
//    public BuyerUserDetailsService(BuyerRepository buyerRepository) {
//        this.buyerRepository = buyerRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        return buyerRepository.fetchByEmail(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + "not found"));
//    }
//}

@Service
public class BuyerUserDetailsService implements UserDetailsService {

    private final GenericUserDetailsService<Buyer> delegate;

    public BuyerUserDetailsService(BuyerRepository buyerRepository) {
        this.delegate = new GenericUserDetailsService<>(buyerRepository::fetchByEmail);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return delegate.loadUserByUsername(username);
    }
}