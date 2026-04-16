package com.wegroup423.smart_campus.features.notification.model;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;
    private String title;
    private String message;
    private NotificationType type;

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private String relatedEntityId;   // booking ID / ticket ID
    private String relatedEntityType; // "BOOKING" / "TICKET" / "COMMENT"

    public enum NotificationType {
        BOOKING_APPROVED,
        BOOKING_REJECTED,
        BOOKING_CANCELLED, 
        TICKET_STATUS_CHANGED,
        TICKET_ASSIGNED,
        NEW_COMMENT,
        GENERAL
    }
}