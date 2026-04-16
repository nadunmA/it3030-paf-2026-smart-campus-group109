package com.wegroup423.smart_campus.features.admin.model.dto.response;

import java.time.Instant;
import java.time.LocalDate;

public record ResourceResponse(
        String id,
        String name,
        String resourceTypeId,
        String resourceTypeName,
        String location,
        Integer capacity,
        String availability,
        Double cost,
        LocalDate warrantyExpiry,
        String assignedTechnicianId,
        String assignedTechnicianName,
        String serialNumber,
        String condition,
        LocalDate maintenanceDate,
        String qrCode,
        Instant createdAt,
        Instant updatedAt
) {}
