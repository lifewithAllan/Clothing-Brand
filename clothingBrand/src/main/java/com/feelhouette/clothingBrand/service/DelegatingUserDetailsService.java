package com.feelhouette.clothingBrand.service;

import com.feelhouette.clothingBrand.service.buyer.BuyerUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DelegatingUserDetailsService implements UserDetailsService {

    private final MyUserDetailsService userDetailsService;
    private final BuyerUserDetailsService buyerDetailsService;

    public DelegatingUserDetailsService(MyUserDetailsService userDetailsService,
                                        BuyerUserDetailsService buyerDetailsService) {
        this.userDetailsService = userDetailsService;
        this.buyerDetailsService = buyerDetailsService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            return buyerDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException ex) {
            return userDetailsService.loadUserByUsername(username);
        }
    }
}
