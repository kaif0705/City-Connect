package com.cityconnect.backend.service;

import com.cityconnect.backend.dto.CommentRequest;
import com.cityconnect.backend.dto.CommentResponse;
import java.util.List;

public interface CommentService {

    /**
     * Creates a new comment on a specific issue.
     * @param issueId The ID of the issue to comment on.
     * @param commentRequest The DTO containing the comment content.
     * @return The newly created CommentResponse DTO.
     */
    CommentResponse createComment(Long issueId, CommentRequest commentRequest);

    /**
     * Retrieves all comments for a specific issue.
     * (This method name now matches the implementation)
     *
     * @param issueId The ID of the issue.
     * @return A list of CommentResponse DTOs.
     */
    List<CommentResponse> getAllCommentsForIssue(Long issueId);
}