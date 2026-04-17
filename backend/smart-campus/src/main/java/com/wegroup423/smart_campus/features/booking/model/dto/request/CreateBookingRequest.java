package com.wegroup423.smart_campus.features.booking.model.dto.request;

import com.wegroup423.smart_campus.features.booking.model.enums.ResourceType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record CreateBookingRequest(
        @NotBlank String resourceId,
        @NotNull ResourceType resourceType,
        @NotNull @Future LocalDate bookingDate,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @NotBlank String purpose,
        @Min(1) int expectedAttendees
) {}
