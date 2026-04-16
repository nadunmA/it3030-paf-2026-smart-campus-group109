package com.wegroup423.smart_campus.features.admin.model.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateResourceTypeRequest(
        @NotBlank(message = "name is required")
        String name,

        String description
) {}
