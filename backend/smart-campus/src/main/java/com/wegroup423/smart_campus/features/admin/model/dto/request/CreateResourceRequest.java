package com.wegroup423.smart_campus.features.admin.model.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateResourceRequest(
        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "resourceTypeId is required")
        String resourceTypeId,

        @NotBlank(message = "location is required")
        String location,

        @NotNull(message = "capacity is required")
        @Positive(message = "capacity must be positive")
        Integer capacity,

        @NotNull(message = "cost is required")
        @PositiveOrZero(message = "cost must be non-negative")
        Double cost,

        LocalDate warrantyExpiry,

        String assignedTechnicianId,

        String serialNumber,

        String condition,

        LocalDate maintenanceDate
) {}
