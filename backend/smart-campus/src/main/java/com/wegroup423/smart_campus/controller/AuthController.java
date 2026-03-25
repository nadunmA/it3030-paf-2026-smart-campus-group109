package com.wegroup423.smart_campus.controller;


import com.wegroup423.smart_campus.entity.User;
import com.wegroup423.smart_campus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    // GET /api/auth/me — get logged-in user profile
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // GET /api/auth/validate — check if token is still valid
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "userId", userId
        ));
    }
}