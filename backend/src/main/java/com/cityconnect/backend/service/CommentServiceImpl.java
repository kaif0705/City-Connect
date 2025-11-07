package com.cityconnect.backend.service;

import com.cityconnect.backend.dto.CommentRequest;
import com.cityconnect.backend.dto.CommentResponse;
import com.cityconnect.backend.entity.Comment;
import com.cityconnect.backend.entity.Issue;
import com.cityconnect.backend.entity.User;
import com.cityconnect.backend.exception.ResourceNotFoundException;
import com.cityconnect.backend.repository.CommentRepository;
import com.cityconnect.backend.repository.IssueRepository; // 1. MAKE SURE THIS IMPORT IS HERE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // --- 2. THIS WAS THE MISSING LINE ---
    @Autowired
    private IssueRepository issueRepository;

    // We also need the User for the mapper
    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }


    // --- GET ALL COMMENTS (This is where the bug was) ---
    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getAllCommentsForIssue(Long issueId) {
        // 3. This line will now work correctly
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        List<Comment> comments = commentRepository.findByIssueOrderByCreatedAtAsc(issue);

        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- CREATE A NEW COMMENT ---
    @Override
    @Transactional
    public CommentResponse createComment(Long issueId, CommentRequest commentRequest) {
        User currentUser = getAuthenticatedUser();

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        Comment newComment = new Comment();
        newComment.setContent(commentRequest.getContent());
        newComment.setIssue(issue);
        newComment.setUser(currentUser);

        Comment savedComment = commentRepository.save(newComment);

        return mapToResponse(savedComment);
    }

    // --- Private Helper Method to map Entity -> DTO ---
    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());

        // This check prevents errors if a user was deleted
        if (comment.getUser() != null) {
            response.setUsername(comment.getUser().getUsername());
        } else {
            response.setUsername("Deleted User");
        }

        return response;
    }
}