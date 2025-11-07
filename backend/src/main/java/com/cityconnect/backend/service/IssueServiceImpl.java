package com.cityconnect.backend.service;

import com.cityconnect.backend.dto.IssueRequest;
import com.cityconnect.backend.dto.IssueResponse;
import com.cityconnect.backend.entity.Issue;
import com.cityconnect.backend.entity.User;
import com.cityconnect.backend.exception.ResourceNotFoundException;
import com.cityconnect.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This is the implementation of the IssueService interface.
 * It contains the business logic for managing issues.
 * The @Service annotation tells Spring to manage this as a bean.
 */
@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    // Create an Issue
    @Override
    @Transactional
    public IssueResponse createIssue(IssueRequest issueRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //Map the DTO to an Entity
        Issue newIssue = mapToEntity(issueRequest);

        //LINK THE USER TO THE ISSUE ---
        newIssue.setUser(user);

        //Save the new entity
        Issue savedIssue = issueRepository.save(newIssue);

        return mapToResponse(savedIssue);
    }

    //Get all Issues
    @Override
    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues() {
        List<Issue> issues = issueRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return issues.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update an Issue
    @Override
    @Transactional
    public IssueResponse updateIssueStatus(Long id, String newStatus) {
        Issue issueToUpdate = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issueToUpdate.setStatus(newStatus);
        Issue updatedIssue = issueRepository.save(issueToUpdate);
        return mapToResponse(updatedIssue);
    }

    // Delete an Issue
    @Override
    @Transactional
    public void deleteIssue(Long id) {
        // 1. Check if the issue exists.
        //    This will throw ResourceNotFoundException if it doesn't.
        if (!issueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Issue not found with id: " + id);
        }

        // 2. If it exists, delete it.
        issueRepository.deleteById(id);
    }

    //Get Issues for current user
    @Override
    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesForCurrentUser() {
        // 1. Get the currently authenticated user principal from the security context
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 2. Call our new repository method
        List<Issue> issues = issueRepository.findByUserOrderByCreatedAtDesc(currentUser);

        // 3. Map the list of entities to a list of response DTOs
        return issues.stream()
                .map(this::mapToResponse) // Use our existing helper
                .collect(Collectors.toList());
    }


    // --- Private Helper Methods for Mapping ---

    private Issue mapToEntity(IssueRequest dto) {
        Issue issue = new Issue();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setCategory(dto.getCategory());
        issue.setLatitude(dto.getLatitude());
        issue.setLongitude(dto.getLongitude());
        issue.setImageUrl(dto.getImageUrl());
        return issue;
    }

    private IssueResponse mapToResponse(Issue entity) {
        IssueResponse response = new IssueResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setCategory(entity.getCategory());
        response.setStatus(entity.getStatus());
        response.setLatitude(entity.getLatitude());
        response.setLongitude(entity.getLongitude());
        response.setCreatedAt(entity.getCreatedAt());
        response.setImageUrl(entity.getImageUrl());
        //ADD THE USERNAME TO THE RESPONSE ---
        if (entity.getUser() != null) {
            response.setSubmittedByUsername(entity.getUser().getUsername());
        }
        return response;
    }
}
