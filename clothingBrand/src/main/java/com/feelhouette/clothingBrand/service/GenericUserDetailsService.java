package com.feelhouette.clothingBrand.service;

import org.springframework.cglib.core.internal.Function;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class GenericUserDetailsService<T extends UserDetails> {

    private final Function<String, Optional<T>> fetchByEmail;

    public GenericUserDetailsService(Function<String, Optional<T>> fetchByEmail) {
        this.fetchByEmail = fetchByEmail;
    }

    public UserDetails loadUserByUsername(String username) {
        return fetchByEmail.apply(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + " not found"));
    }
}
