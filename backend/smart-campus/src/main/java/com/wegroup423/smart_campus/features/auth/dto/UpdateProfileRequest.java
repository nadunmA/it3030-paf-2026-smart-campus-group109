package com.wegroup423.smart_campus.features.auth.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,
        String picture
) {
}
