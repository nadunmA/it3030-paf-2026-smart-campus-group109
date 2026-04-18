package com.wegroup423.smart_campus.features.auth.dto;

public record AuthResponse(
        String token,
        String tokenType,
        UserDto user
) {}
