package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;

public record UpdateTicketRequest(
        TicketStatus status,
        String assignedTechnicianId,
        String resolutionNotes,
        String rejectionReason
) {}
