package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EditCommentRequest(

        @NotBlank(message = "content is required")
        @Size(max = 500, message = "comment must not exceed 500 characters")
        String content
) {}
