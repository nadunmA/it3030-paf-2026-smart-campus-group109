package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateRequest(
        @NotNull TicketStatus status,
        String resolutionNote
) {}
