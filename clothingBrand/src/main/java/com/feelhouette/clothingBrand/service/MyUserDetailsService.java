package com.feelhouette.clothingBrand.service;

import com.feelhouette.clothingBrand.model.User;
import com.feelhouette.clothingBrand.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public MyUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return users.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + "not found"));
    }
}

