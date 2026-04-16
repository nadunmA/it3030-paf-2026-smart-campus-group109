package com.wegroup423.smart_campus.features.admin.model.dto.response;

public record ResourceTypeResponse(
        String id,
        String name,
        String description,
        boolean isDefault
) {}
