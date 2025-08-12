package com.feelhouette.clothingBrand.service;

import com.feelhouette.clothingBrand.model.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {
    private final SecretKey secretKey;
    private final long accessTokenMillis;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.accessTokenExpirationMinutes}") long accessTokenMinutes) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenMillis = accessTokenMinutes * 60L * 1000L;
    }

    public String generateAccessToken(String subject, Set<Role> roles) {
        Instant now = Instant.now();
        Date expiry = Date.from(now.plusMillis(accessTokenMillis));
        String rolesClaim = roles.stream().map(Enum::name).collect(Collectors.joining(","));
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(expiry)
                .claim("roles", rolesClaim)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    public String getSubject(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
}

