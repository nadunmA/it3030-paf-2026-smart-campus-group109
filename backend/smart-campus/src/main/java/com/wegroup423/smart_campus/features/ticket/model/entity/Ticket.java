package com.wegroup423.smart_campus.features.ticket.model.entity;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;
    private String location;
    private String resourceId;
    private String resourceName;

    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;

    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    private TicketCategory category;

    private String createdBy;
    private String reportedBy;

    private String assignedTechnicianId;
    private String assignedTechnicianName;

    private String resolutionNote;

    @Builder.Default
    private List<TicketComment> comments = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
