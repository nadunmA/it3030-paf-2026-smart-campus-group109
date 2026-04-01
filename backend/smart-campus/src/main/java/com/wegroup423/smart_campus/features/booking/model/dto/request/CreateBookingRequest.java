package com.wegroup423.smart_campus.features.booking.model.dto.request;

import com.wegroup423.smart_campus.features.booking.model.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record CreateBookingRequest(
        @NotBlank(message = "resourceId is required")
        String resourceId,

        @NotNull(message = "resourceType is required")
        ResourceType resourceType,

        @NotNull(message = "bookingDate is required")
        LocalDate bookingDate,

        @NotNull(message = "startTime is required")
        LocalTime startTime,

        @NotNull(message = "endTime is required")
        LocalTime endTime,

        @NotBlank(message = "purpose is required")
        String purpose,

        @NotNull(message = "expectedAttendees is required")
        @Min(value = 1, message = "expectedAttendees must be at least 1")
        Integer expectedAttendees
) {
}
