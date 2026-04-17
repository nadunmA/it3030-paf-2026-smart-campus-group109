package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 2000) String description,
        String location,
        String resourceId,
        String resourceName,
        TicketCategory category,
        Priority priority
) {}
