package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;

public record UpdateTicketRequest(
        String title,
        String description,
        String location,
        String resourceId,
        String resourceName,
        TicketCategory category,
        Priority priority,
        String assignedTechnicianId,
        String assignedTechnicianName
) {}
