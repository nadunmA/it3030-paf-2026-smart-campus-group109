package com.wegroup423.smart_campus.features.ticket.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {

    private String id;
    private String userId;
    private String userName;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}
