package com.wegroup423.smart_campus.features.auth.controller;

import com.wegroup423.smart_campus.features.auth.dto.AuthResponse;
import com.wegroup423.smart_campus.features.auth.dto.LoginRequest;
import com.wegroup423.smart_campus.features.auth.dto.RegisterRequest;
import com.wegroup423.smart_campus.features.auth.dto.UserDto;
import com.wegroup423.smart_campus.features.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthControllerV2 {

    private final AuthService authService;

    /**
     * POST /api/auth/login — Login with email and password (future use)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register — Register new user (future use)
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/auth/me — Fetch current authenticated user (OAuth ready)
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Object principal) {
        UserDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(user);
    }

    /**
     * GET /api/auth/validate — Lightweight token validation (OAuth ready)
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@AuthenticationPrincipal Object principal) {
        Map<String, Object> result = authService.validateToken(principal);
        return ResponseEntity.ok(result);
    }
}
