package com.wegroup423.smart_campus.features.admin.model.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UpdateResourceRequest(
        String name,
        String resourceTypeId,
        String type,
        String description,
        String location,
        Integer capacity,
        Double cost,
        LocalDate warrantyExpiry,
        String assignedTechnicianId,
        String serialNumber,
        String usageInstructions,
        String condition,
        LocalDate maintenanceDate,
        LocalDateTime availabilityStart,
        LocalDateTime availabilityEnd,
        String availability,
        String status
) {}
