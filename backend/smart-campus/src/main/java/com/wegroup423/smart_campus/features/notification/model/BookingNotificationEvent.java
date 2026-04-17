package com.wegroup423.smart_campus.features.notification.model;

import java.time.Instant;

public record BookingNotificationEvent(
        String action,
        String bookingId,
        String resourceId,
        String ownerUserId,
        String status,
        String triggeredBy,
        String reason,
        Instant occurredAt
) {}
