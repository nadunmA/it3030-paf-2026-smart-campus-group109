package com.wegroup423.smart_campus.features.auth.service.impl;

import com.wegroup423.smart_campus.features.auth.dto.AuthResponse;
import com.wegroup423.smart_campus.features.auth.dto.LoginRequest;
import com.wegroup423.smart_campus.features.auth.dto.RegisterRequest;
import com.wegroup423.smart_campus.features.auth.dto.UserDto;
import com.wegroup423.smart_campus.features.auth.exception.InvalidCredentialsException;
import com.wegroup423.smart_campus.features.auth.exception.UserNotFoundException;
import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import com.wegroup423.smart_campus.features.auth.security.JwtUtil;
import com.wegroup423.smart_campus.features.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Login with email and password
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    log.warn("User not found: {}", request.email());
                    return new UserNotFoundException("User not found");
                });

        if (!user.isActive()) {
            log.warn("Account inactive: {}", request.email());
            throw new InvalidCredentialsException("Account is inactive");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Invalid password for user: {}", request.email());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        log.info("User logged in successfully: {}", user.getEmail());

        return new AuthResponse(token, "Bearer", UserDto.from(user));
    }

    /**
     * Register new user with email and password
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Register attempt for email: {}", request.email());

        if (userRepository.findByEmail(request.email()).isPresent()) {
            log.warn("Email already exists: {}", request.email());
            throw new InvalidCredentialsException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .picture(request.picture())
                .password(passwordEncoder.encode(request.password()))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", request.email());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, "Bearer", UserDto.from(user));
    }

    /**
     * Retrieve current authenticated user
     */
    @Override
    public UserDto getCurrentUser(Object principal) {
        if (principal == null) {
            throw new UserNotFoundException("Unauthorized - no principal provided");
        }

        User user = resolveUser(principal);
        log.info("User retrieved: {}", user.getEmail());
        return UserDto.from(user);
    }

    /**
     * Validate token and return user identifier
     */
    @Override
    public Map<String, Object> validateToken(Object principal) {
        if (principal == null) {
            return Map.of("valid", false, "userId", "unknown");
        }

        String identifier = extractIdentifier(principal);
        log.info("Token validated for user: {}", identifier);
        return Map.of("valid", true, "userId", identifier);
    }

    /**
     * Resolve user from principal (can be User entity, UserDetails, or String identifier)
     */
    private User resolveUser(Object principal) {
        // Case 1: principal is the full User entity
        if (principal instanceof User user) {
            return user;
        }

        // Case 2 & 3: Extract identifier and query repository
        String identifier = extractIdentifier(principal);

        // Try by MongoDB id first, then by email as fallback
        return userRepository.findById(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UserNotFoundException("User not found: " + identifier));
    }

    /**
     * Extract identifier from principal (UserDetails, String, or other)
     */
    private String extractIdentifier(Object principal) {
        if (principal instanceof UserDetails ud) {
            return ud.getUsername();
        }
        return principal.toString();
    }
}
