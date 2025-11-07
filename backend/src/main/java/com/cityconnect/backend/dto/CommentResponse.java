package com.cityconnect.backend.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private Instant createdAt;

    // We only expose the username, not the whole User object
    private String username;

    // We include the issueId for reference
    private Long issueId;
}