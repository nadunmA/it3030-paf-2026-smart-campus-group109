package com.wegroup423.smart_campus.features.booking.model.dto.response;

import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.model.enums.ResourceType;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(
        String id,
        String userId,
        String resourceId,
        ResourceType resourceType,
        LocalDate bookingDate,
        LocalTime startTime,
        LocalTime endTime,
        String purpose,
        int expectedAttendees,
        BookingStatus status,
        String approvedBy,
        String rejectionReason
) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getResourceId(),
                booking.getResourceType(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getApprovedBy(),
                booking.getRejectionReason()
        );
    }
}
