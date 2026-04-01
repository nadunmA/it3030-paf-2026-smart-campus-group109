package com.wegroup423.smart_campus.features.booking.model.enums;

public enum BookingStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED;

    public boolean canTransitionTo(BookingStatus target) {
        if (target == null) {
            return false;
        }

        return switch (this) {
            case PENDING -> target == APPROVED || target == REJECTED || target == CANCELLED;
            case APPROVED -> target == CANCELLED;
            case REJECTED, CANCELLED -> false;
        };
    }
}
