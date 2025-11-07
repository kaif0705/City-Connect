package com.cityconnect.backend.service;

import com.cityconnect.backend.dto.IssueRequest;
import com.cityconnect.backend.dto.IssueResponse;

import java.util.List;

public interface IssueService {

    IssueResponse createIssue(IssueRequest issueRequest);
    List<IssueResponse> getAllIssues();
    IssueResponse updateIssueStatus(Long id, String newStatus);
    void deleteIssue(Long id);
    List<IssueResponse> getIssuesForCurrentUser();

}
