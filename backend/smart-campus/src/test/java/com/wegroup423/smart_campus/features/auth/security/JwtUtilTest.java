package com.wegroup423.smart_campus.features.auth.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private final String secret = "SmartCampusDefaultJwtSecretKeyForDevOnly2026!";
    private final long expiration = 86400000L;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", expiration);
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void validateToken_shouldReturnTrue_whenTokenIsValid() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");

        boolean result = jwtUtil.validateToken(token);

        assertTrue(result);
    }

    @Test
    void validateToken_shouldReturnFalse_whenTokenIsInvalid() {
        String invalidToken = "this.is.not.a.valid.token";

        boolean result = jwtUtil.validateToken(invalidToken);

        assertFalse(result);
    }

    @Test
    void getUserIdFromToken_shouldReturnCorrectUserId() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");

        String userId = jwtUtil.getUserIdFromToken(token);

        assertEquals("user-123", userId);
    }

    @Test
    void getEmailFromToken_shouldReturnCorrectEmail() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");

        String email = jwtUtil.getEmailFromToken(token);

        assertEquals("nadun@gmail.com", email);
    }

    @Test
    void getRoleFromToken_shouldReturnCorrectRole() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "ADMIN");

        String role = jwtUtil.getRoleFromToken(token);

        assertEquals("ADMIN", role);
    }

    @Test
    void validateToken_shouldReturnFalse_whenTokenIsTampered() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");


        String tamperedToken = token.substring(0, token.length() - 2) + "ab";

        boolean result = jwtUtil.validateToken(tamperedToken);

        assertFalse(result);
    }

    @Test
    void generatedToken_shouldContainExpectedClaims() {
        String token = jwtUtil.generateToken("user-123", "nadun@gmail.com", "USER");

        Key signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals("user-123", claims.getSubject());
        assertEquals("nadun@gmail.com", claims.get("email"));
        assertEquals("USER", claims.get("role"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }
}