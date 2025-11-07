package com.cityconnect.backend.repository;

import com.cityconnect.backend.entity.Comment;
import com.cityconnect.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Finds all comments for a specific issue, ordered by creation time (oldest first).
     */
    List<Comment> findByIssueOrderByCreatedAtAsc(Issue issue);
}