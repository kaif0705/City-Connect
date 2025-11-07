package com.cityconnect.backend.controller;

import com.cityconnect.backend.dto.CommentRequest;
import com.cityconnect.backend.dto.CommentResponse;
import com.cityconnect.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/issues/{issueId}/comments") // All endpoints are nested under an issue
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     * Creates a new comment on an issue.
     * Only users with the role 'ADMIN' can access this endpoint.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // This enforces ADMIN-only access
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long issueId,
            @Valid @RequestBody CommentRequest commentRequest) {

        // The service will get the logged-in admin user from the SecurityContext
        CommentResponse newComment = commentService.createComment(issueId, commentRequest);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    /**
     * Gets all comments for a specific issue.
     * As per our SecurityConfig, this path (/api/v1/issues/...) is accessible
     * to both CITIZEN and ADMIN roles.
     */
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsForIssue(
            @PathVariable Long issueId) {

        List<CommentResponse> comments = commentService.getAllCommentsForIssue(issueId);
        return ResponseEntity.ok(comments);
    }
}