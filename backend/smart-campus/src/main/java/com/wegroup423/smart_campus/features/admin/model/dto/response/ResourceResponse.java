package com.wegroup423.smart_campus.features.admin.model.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ResourceResponse(
        String id,
        String name,
        String type,
        String description,
        String resourceTypeId,
        String resourceTypeName,
        String location,
        Integer capacity,
        LocalDateTime availabilityStart,
        LocalDateTime availabilityEnd,
        String availability,
        String status,
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
