package com.wegroup423.smart_campus.features.booking.model.dto.request;

import jakarta.validation.constraints.Size;

public record BookingDecisionRequest(
        @Size(max = 500, message = "reason must be at most 500 characters")
        String reason
) {
}
