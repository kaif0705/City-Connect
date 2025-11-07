package com.cityconnect.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for cases where a requested resource is not found.
 * * When this exception is thrown from a controller, Spring will automatically
 * return a 404 NOT_FOUND HTTP status code.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructor that takes a custom error message.
     * @param message The detail message.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor that takes a message and the original cause.
     * @param message The detail message.
     * @param cause The original throwable cause.
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}