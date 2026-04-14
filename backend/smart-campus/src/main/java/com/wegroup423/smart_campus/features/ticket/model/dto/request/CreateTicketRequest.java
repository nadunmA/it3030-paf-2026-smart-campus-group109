package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(

        String resourceId,

        @NotBlank(message = "location is required")
        String location,

        @NotNull(message = "category is required")
        TicketCategory category,

        @NotBlank(message = "description is required")
        @Size(min = 10, max = 1000, message = "description must be between 10 and 1000 characters")
        String description,

        @NotNull(message = "priority is required")
        Priority priority,

        @NotBlank(message = "preferredContact is required")
        String preferredContact
) {}
