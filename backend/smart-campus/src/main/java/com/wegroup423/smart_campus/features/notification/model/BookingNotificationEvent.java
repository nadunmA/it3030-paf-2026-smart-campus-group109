package com.wegroup423.smart_campus.features.notification.model;

import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import java.time.Instant;

public record BookingNotificationEvent(
        String action,
        String bookingId,
        String resourceId,
        String ownerUserId,
        BookingStatus status,
        String triggeredBy,
        String reason,
        Instant occurredAt
) {}
