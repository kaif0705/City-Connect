package com.cityconnect.backend.repository;

import com.cityconnect.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;import com.cityconnect.backend.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the Issue entity.
 * This interface handles all database operations (CRUD) for Issues.
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    /**
     * Finds all issues submitted by a specific user,
     * sorted by creation date in descending order (newest first).
     */
    List<Issue> findByUserOrderByCreatedAtDesc(User user);
}
