package com.wegroup423.smart_campus.features.booking.model.dto.response;

import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.model.enums.ResourceType;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(
        String id,
        String resourceId,
        ResourceType resourceType,
        String userId,
        LocalDate bookingDate,
        LocalTime startTime,
        LocalTime endTime,
        String purpose,
        Integer expectedAttendees,
        BookingStatus status,
        String approvedBy,
        String rejectedBy,
        String rejectionReason,
        Instant createdAt,
        Instant updatedAt
) {
}
