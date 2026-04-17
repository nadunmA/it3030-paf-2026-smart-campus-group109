package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AssignTicketRequest(
        @NotBlank String technicianId,
        @NotBlank String technicianName
) {}
