package com.wegroup423.smart_campus.features.auth.dto;

import com.wegroup423.smart_campus.features.auth.model.User;
import java.time.LocalDateTime;

public record UserDto(
        String id,
        String name,
        String email,
        String picture,
        String role,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime lastLoginAt
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPicture(),
                user.getRole() != null ? user.getRole().name() : "USER",
                user.isActive(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }
}
