package com.cityconnect.backend.service;

import com.cityconnect.backend.dto.IssueRequest;
import com.cityconnect.backend.dto.IssueResponse;
import com.cityconnect.backend.entity.Issue;
import com.cityconnect.backend.exception.ResourceNotFoundException;
import com.cityconnect.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

    @Override
    @Transactional
    public IssueResponse createIssue(IssueRequest issueRequest) {
        Issue newIssue = mapToEntity(issueRequest);
        Issue savedIssue = issueRepository.save(newIssue);
        return mapToResponse(savedIssue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues() {
        List<Issue> issues = issueRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return issues.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IssueResponse updateIssueStatus(Long id, String newStatus) {
        Issue issueToUpdate = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issueToUpdate.setStatus(newStatus);
        Issue updatedIssue = issueRepository.save(issueToUpdate);
        return mapToResponse(updatedIssue);
    }


    // --- Private Helper Methods for Mapping ---

    private Issue mapToEntity(IssueRequest dto) {
        Issue issue = new Issue();
        issue.setTitle(dto.getTitle());
        issue.setDescription(dto.getDescription());
        issue.setCategory(dto.getCategory());
        issue.setLatitude(dto.getLatitude());
        issue.setLongitude(dto.getLongitude());
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
        return response;
    }
}
