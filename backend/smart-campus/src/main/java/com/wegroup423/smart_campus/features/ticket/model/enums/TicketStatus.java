package com.wegroup423.smart_campus.features.ticket.model.enums;

public enum TicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED;

    public boolean canTransitionTo(TicketStatus target) {
        if (target == null) return false;
        return switch (this) {
            case OPEN       -> target == IN_PROGRESS || target == REJECTED || target == CLOSED;
            case IN_PROGRESS -> target == RESOLVED || target == CLOSED;
            case RESOLVED   -> target == CLOSED;
            case CLOSED, REJECTED -> false;
        };
    }
}
