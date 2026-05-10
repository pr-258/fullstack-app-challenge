package com.paulorinze.backend.dto;

public record DashboardStatsResponse(
        long totalCollaborators,
        long pendingRequests,
        long approvedRequests,
        long rejectedRequests,
        long totalApprovedDays
) {}
