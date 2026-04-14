package com.wegroup423.smart_campus.features.ticket.model.dto.response;

import java.time.Instant;

public record CommentResponse(
        String id,
        String userId,
        String userName,
        String content,
        Instant createdAt,
        Instant updatedAt
) {}
