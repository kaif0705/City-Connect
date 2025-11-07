package com.cityconnect.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString; // 1. ADD THIS IMPORT
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    private Instant createdAt;

    // --- 2. ADD @ToString.Exclude TO THIS FIELD ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    @ToString.Exclude
    private Issue issue;

    // This field should already be here
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;
}