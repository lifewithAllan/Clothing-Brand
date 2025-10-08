package com.feelhouette.clothingBrand.service;

import org.springframework.cglib.core.internal.Function;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class GenericUserDetailsService<T extends UserDetails> {

    private final Function<String, Optional<T>> fetchByEmail;
    private final Function<String, Optional<T>> fetchByFirstName;

    public GenericUserDetailsService(Function<String, Optional<T>> fetchByEmail) {
        this.fetchByEmail = fetchByEmail;
        this.fetchByFirstName = null;
    }

    public GenericUserDetailsService(Function<String, Optional<T>> fetchByEmail,
                                     Function<String, Optional<T>> fetchByFirstName) {
        this.fetchByEmail = fetchByEmail;
        this.fetchByFirstName = fetchByFirstName;
    }

    public UserDetails loadUserByUsername(String username) {
        // FIRST try first name lookup (new priority)
        Optional<T> user = null;
        if (fetchByFirstName != null) {
            user = fetchByFirstName.apply(username);
        }

        // If not found by first name, try email lookup
        if (user == null || user.isEmpty()) {
            user = fetchByEmail.apply(username);
        }

        return user
                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + " not found"));
    }
}