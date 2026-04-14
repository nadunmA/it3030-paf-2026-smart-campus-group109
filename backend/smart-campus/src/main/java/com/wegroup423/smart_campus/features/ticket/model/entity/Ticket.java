package com.wegroup423.smart_campus.features.ticket.model.entity;

import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketCategory;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
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

    private String resourceId;
    private String location;

    @Indexed
    private String createdBy;         // userId of ticket creator

    private TicketCategory category;
    private String description;
    private Priority priority;

    @Indexed
    private TicketStatus status;

    private String assignedTechnicianId;

    private String resolutionNotes;
    private String rejectionReason;

    private String preferredContact;

    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();  // up to 3 image filenames

    @Builder.Default
    private List<TicketComment> comments = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;
}
