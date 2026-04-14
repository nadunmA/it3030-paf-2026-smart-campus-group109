package com.wegroup423.smart_campus.features.ticket.model.dto.response;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;

import java.time.Instant;
import java.util.List;

public record TicketResponse(
        String id,
        String resourceId,
        String location,
        String createdBy,
        TicketCategory category,
        String description,
        Priority priority,
        TicketStatus status,
        String assignedTechnicianId,
        String resolutionNotes,
        String rejectionReason,
        String preferredContact,
        List<String> attachmentUrls,
        List<CommentResponse> comments,
        Instant createdAt,
        Instant updatedAt
) {}
