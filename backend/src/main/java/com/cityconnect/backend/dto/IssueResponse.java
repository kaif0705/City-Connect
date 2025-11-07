package com.cityconnect.backend.dto;

import lombok.Data;
import java.time.Instant;

@Data // Lombok: Adds getters, setters
public class IssueResponse {

    // This is the DTO we will send back to the user.
    // It's safe to include all these fields for now.

    private Long id;
    private String title;
    private String description;
    private String category;
    private String status;
    private Double latitude;
    private Double longitude;
    private Instant createdAt;
    private String imageUrl;
    private String submittedByUsername; // To show who created the issue

    // We can add more fields later, like:
    // private String submittedByUsername;
}
