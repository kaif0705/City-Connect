package com.cityconnect.backend.controller;

import com.cityconnect.backend.dto.AuthResponse;
import com.cityconnect.backend.dto.LoginRequest;
import com.cityconnect.backend.dto.RegisterRequest;
import com.cityconnect.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Controller for handling user Authentication (Login and Register).
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from our React frontend
public class AuthController {

    // Inject the Interface, not the implementation
    @Autowired
    private AuthService authService;

    /**
     * Endpoint for registering a new user.
     * @param registerRequest DTO containing username, email, and password.
     * @return ResponseEntity with AuthResponse (JWT, username, role) and HTTP 201.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // The service handles all logic (checking duplicates, hashing password, saving user)
        AuthResponse authResponse = authService.registerUser(registerRequest);

        // Return 201 Created
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    /**
     * Endpoint for authenticating an existing user.
     * @param loginRequest DTO containing username and password.
     * @return ResponseEntity with AuthResponse (JWT, username, role) and HTTP 200.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        // The service handles all logic (authentication, token generation)
        // It will throw BadCredentialsException if login fails (handled by GlobalExceptionHandler)
        AuthResponse authResponse = authService.loginUser(loginRequest);

        // Return 200 OK
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}