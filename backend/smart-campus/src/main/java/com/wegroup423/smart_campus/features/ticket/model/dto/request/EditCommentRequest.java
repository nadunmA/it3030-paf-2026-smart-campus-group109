package com.wegroup423.smart_campus.features.ticket.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EditCommentRequest(
        @NotBlank @Size(max = 1000) String content
) {}
