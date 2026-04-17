package com.wegroup423.smart_campus.features.ticket.model.dto.response;

import com.wegroup423.smart_campus.features.ticket.model.entity.Ticket;
import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
        String id,
        String title,
        String description,
        String location,
        String resourceId,
        String resourceName,
        TicketStatus status,
        Priority priority,
        TicketCategory category,
        String createdBy,
        String reportedBy,
        String assignedTechnicianId,
        String assignedTechnicianName,
        String resolutionNote,
        List<CommentResponse> comments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt
) {
    public static TicketResponse from(Ticket ticket) {
        List<CommentResponse> commentResponses = ticket.getComments() == null
                ? List.of()
                : ticket.getComments().stream().map(CommentResponse::from).toList();

        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getLocation(),
                ticket.getResourceId(),
                ticket.getResourceName(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCategory(),
                ticket.getCreatedBy(),
                ticket.getReportedBy(),
                ticket.getAssignedTechnicianId(),
                ticket.getAssignedTechnicianName(),
                ticket.getResolutionNote(),
                commentResponses,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getResolvedAt()
        );
    }
}
