package com.paulorinze.backend.dto;

import com.paulorinze.backend.enums.VacationRequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record VacationRequestResponse(
        UUID id,
        UUID collaboratorId,
        String collaboratorName,
        UUID managerId,
        String managerName,
        LocalDate startDate,
        LocalDate endDate,
        int inclusiveDays,
        VacationRequestStatus status,
        String reason,
        UUID reviewedById,
        String reviewedByName,
        Instant reviewedAt,
        String rejectionReason,
        Instant cancelledAt,
        Instant createdAt,
        Instant updatedAt
) {}
