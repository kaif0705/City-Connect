package com.cityconnect.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for cases where a resource already exists.
 * This is typically used for registration when a username or email is already taken.
 *
 * When this exception is thrown from a controller, Spring will automatically
 * return a 409 CONFLICT HTTP status code.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    /**
     * Constructor that takes a custom error message.
     * @param message The detail message.
     */
    public DuplicateResourceException(String message) {
        super(message);
    }

    /**
     * Constructor that takes a message and the original cause.
     * @param message The detail message.
     * @param cause The original throwable cause.
     */
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
