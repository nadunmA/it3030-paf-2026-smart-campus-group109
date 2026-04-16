package com.wegroup423.smart_campus.features.admin.model.dto.request;

import java.time.LocalDate;

public record UpdateResourceRequest(
        String name,
        String resourceTypeId,
        String location,
        Integer capacity,
        Double cost,
        LocalDate warrantyExpiry,
        String assignedTechnicianId,
        String serialNumber,
        String condition,
        LocalDate maintenanceDate,
        String availability
) {}
