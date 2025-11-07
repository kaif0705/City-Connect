package com.cityconnect.backend.controller;

import com.cityconnect.backend.dto.IssueRequest;
import com.cityconnect.backend.dto.IssueResponse;
import com.cityconnect.backend.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST API Controller for managing Issues.
 * This class handles all HTTP requests related to issues.
 */
@RestController
@RequestMapping("/api/v1") // Base path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from our React frontend
public class IssueController {

    // We inject the INTERFACE, not the implementation, for loose coupling
    @Autowired
    private IssueService issueService;

    // --- Slice 1: Create an Issue ---
    // We'll secure this in Slice 4. For now, it's open.
    @PostMapping("/issues")
    public ResponseEntity<IssueResponse> createIssue(@Valid @RequestBody IssueRequest issueRequest) {
        // @Valid triggers our GlobalExceptionHandler if the DTO is invalid
        IssueResponse newIssue = issueService.createIssue(issueRequest);
        // Return 201 Created status
        return new ResponseEntity<>(newIssue, HttpStatus.CREATED);
    }

    // --- Slice 2: Get All Issues (for Admin) ---
    // We'll secure this for Admins in Slice 4.
    @GetMapping("/admin/issues")
    public ResponseEntity<List<IssueResponse>> getAllIssues() {
        List<IssueResponse> issues = issueService.getAllIssues();
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    // --- Slice 3: Update Issue Status (for Admin) ---
    // We'll secure this for Admins in Slice 4.
    @PutMapping("/admin/issues/{id}/status")
    public ResponseEntity<IssueResponse> updateIssueStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {

        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            // You could throw a custom exception here, but for now, this is fine.
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        IssueResponse updatedIssue = issueService.updateIssueStatus(id, newStatus);
        return new ResponseEntity<>(updatedIssue, HttpStatus.OK);
    }

    /**
     * Deletes an issue. This should typically be done after an
     * issue is resolved and archived.
     */
    @DeleteMapping("/admin/issues/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        // The service will throw 404 if not found
        issueService.deleteIssue(id);

        // Return 204 No Content, which is the standard for a successful DELETE
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
