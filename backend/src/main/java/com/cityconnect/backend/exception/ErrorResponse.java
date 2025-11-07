package com.cityconnect.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * A standard DTO (Data Transfer Object) for sending a structured
 * error response to the client.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    // Using Instant for a high-precision, timezone-agnostic timestamp
    private Instant timestamp;

    // The HTTP status code (e.g., 404, 409)
    private int status;

    // The HTTP status reason phrase (e.g., "Not Found", "Conflict")
    private String error;

    // The specific, developer-friendly error message
    private String message;

    // The API path that was called
    private String path;
}
