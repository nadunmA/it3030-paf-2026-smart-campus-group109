package com.wegroup423.smart_campus.features.ticket.model.dto.response;

import com.wegroup423.smart_campus.features.ticket.model.entity.TicketComment;

import java.time.LocalDateTime;

public record CommentResponse(
        String id,
        String authorId,
        String authorName,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CommentResponse from(TicketComment c) {
        return new CommentResponse(
                c.getId(),
                c.getAuthorId(),
                c.getAuthorName(),
                c.getContent(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
