package com.cityconnect.backend.repository;

import com.cityconnect.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Issue entity.
 * This interface handles all database operations (CRUD) for Issues.
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
}
