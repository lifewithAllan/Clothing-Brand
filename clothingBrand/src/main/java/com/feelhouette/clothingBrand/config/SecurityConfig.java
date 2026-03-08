package com.feelhouette.clothingBrand.config;

import com.feelhouette.clothingBrand.service.DelegatingUserDetailsService;
import com.feelhouette.clothingBrand.service.MyUserDetailsService;
import com.feelhouette.clothingBrand.service.JwtService;
import com.feelhouette.clothingBrand.service.buyer.BuyerUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // ✅ Inject both user types and the delegating service
    private final MyUserDetailsService userDetailsService;
    private final BuyerUserDetailsService buyerDetailsService;
    private final DelegatingUserDetailsService delegatingUserDetailsService;
    private final JwtService jwtService;

    public SecurityConfig(
            MyUserDetailsService userDetailsService,
            BuyerUserDetailsService buyerDetailsService,
            DelegatingUserDetailsService delegatingUserDetailsService,
            JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.buyerDetailsService = buyerDetailsService;
        this.delegatingUserDetailsService = delegatingUserDetailsService;
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // ✅ Use delegating service in JWT filter to support both users and buyers
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtService, delegatingUserDetailsService);

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/seller/**", "/api/auth/buyer/**", "/api/buyer/account/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/buyer/login").permitAll()
                        .requestMatchers("/api/buyer/**").hasRole("BUYER")
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/actuator/**").permitAll()
                        .anyRequest().authenticated()
                )
                // ✅ Use custom AuthenticationManager that supports both providers
                .authenticationManager(authenticationManager(userAuthProvider(), buyerAuthProvider()))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ Provider for authenticating regular users
    @Bean
    public DaoAuthenticationProvider userAuthProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ✅ Provider for authenticating buyers
    @Bean
    public DaoAuthenticationProvider buyerAuthProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(buyerDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ✅ Delegating AuthenticationManager that tries both providers
    @Bean
    public AuthenticationManager authenticationManager(
            DaoAuthenticationProvider userAuthProvider,
            DaoAuthenticationProvider buyerAuthProvider) {
        return new ProviderManager(List.of(buyerAuthProvider, userAuthProvider));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}