package com.wegroup423.smart_campus.features.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Object principal) {

        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized - no principal"));
        }

        // principal is the full User entity already
        if (principal instanceof User user) {
            return ResponseEntity.ok(toSafeMap(user));
        }

        // principal is a Spring UserDetails (username = userId or email)
        String identifier;
        if (principal instanceof UserDetails ud) {
            identifier = ud.getUsername();
        } else {
            // Case 3: plain String (userId or email)
            identifier = principal.toString();
        }

        // Try by MongoDB id first, then by email as fallback
        return userRepository.findById(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toSafeMap(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                        "error", "User not found",
                        "identifier", identifier
                )));
    }

    /** GET /api/auth/validate — lightweight token check */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @AuthenticationPrincipal Object principal) {

        String id = (principal instanceof UserDetails ud)
                ? ud.getUsername()
                : (principal != null ? principal.toString() : "unknown");

        return ResponseEntity.ok(Map.of("valid", true, "userId", id));
    }

    /** Return only safe fields — never expose password/googleId */
    private Map<String, Object> toSafeMap(User user) {
        return Map.of(
                "id",        user.getId()    != null ? user.getId()    : "",
                "name",      user.getName()  != null ? user.getName()  : "",
                "email",     user.getEmail() != null ? user.getEmail() : "",
                "picture",   user.getPicture() != null ? user.getPicture() : "",
                "role",      user.getRole()  != null ? user.getRole().name() : "USER",
                "active",    user.isActive(),
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }
}