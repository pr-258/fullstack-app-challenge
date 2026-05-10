package com.paulorinze.backend.service;

import com.paulorinze.backend.config.ActingUserContext;
import com.paulorinze.backend.dto.*;
import com.paulorinze.backend.entity.User;
import com.paulorinze.backend.entity.VacationRequest;
import com.paulorinze.backend.enums.Role;
import com.paulorinze.backend.enums.VacationRequestStatus;
import com.paulorinze.backend.exception.ConflictException;
import com.paulorinze.backend.exception.ForbiddenException;
import com.paulorinze.backend.exception.NotFoundException;
import com.paulorinze.backend.repository.UserRepository;
import com.paulorinze.backend.repository.VacationRequestRepository;
import com.paulorinze.backend.repository.VacationRequestSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static com.paulorinze.backend.enums.VacationRequestStatus.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VacationRequestService {

    private static final List<VacationRequestStatus> ACTIVE_STATUSES = List.of(PENDING, APPROVED);

    private final VacationRequestRepository vacationRequestRepository;
    private final UserRepository userRepository;
    private final ActingUserContext actingUserContext;

    public PageResponse<VacationRequestResponse> listVacationRequests(
            VacationRequestStatus status,
            UUID collaboratorId,
            UUID managerId,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            Pageable pageable) {

        Specification<VacationRequest> spec = VacationRequestSpecification
                .withFilters(status, collaboratorId, managerId, startDate, endDate, search);

        if (actingUserContext.isCollaborator()) {
            spec = spec.and(VacationRequestSpecification.forCollaborator(actingUserContext.getActingUserId()));
        } else if (actingUserContext.isManager()) {
            spec = spec.and(VacationRequestSpecification.forManager(actingUserContext.getActingUserId()));
        }

        return PageResponse.from(vacationRequestRepository.findAll(spec, pageable).map(this::toResponse));
    }

    public DashboardStatsResponse getDashboardStats() {
        Specification<VacationRequest> baseSpec = (root, query, cb) -> cb.conjunction();

        if (actingUserContext.isCollaborator()) {
            baseSpec = VacationRequestSpecification.forCollaborator(actingUserContext.getActingUserId());
        } else if (actingUserContext.isManager()) {
            baseSpec = VacationRequestSpecification.forManager(actingUserContext.getActingUserId());
        }

        long pending  = vacationRequestRepository.count(baseSpec.and((r, q, cb) -> cb.equal(r.get("status"), PENDING)));
        long approved = vacationRequestRepository.count(baseSpec.and((r, q, cb) -> cb.equal(r.get("status"), APPROVED)));
        long rejected = vacationRequestRepository.count(baseSpec.and((r, q, cb) -> cb.equal(r.get("status"), REJECTED)));

        long totalCollaborators = 0;
        if (actingUserContext.isAdmin()) {
            totalCollaborators = userRepository.countByRoleAndActiveTrue(Role.COLLABORATOR);
        } else if (actingUserContext.isManager()) {
            totalCollaborators = userRepository.countByManager_IdAndActiveTrue(actingUserContext.getActingUserId());
        }

        long totalApprovedDays = actingUserContext.isCollaborator()
                ? vacationRequestRepository.sumApprovedDaysByCollaborator(actingUserContext.getActingUserId())
                : 0L;

        return new DashboardStatsResponse(totalCollaborators, pending, approved, rejected, totalApprovedDays);
    }

    public VacationRequestResponse getVacationRequestById(UUID id) {
        VacationRequest request = findOrThrow(id);
        checkCanView(request);
        return toResponse(request);
    }

    @Transactional
    public VacationRequestResponse createVacationRequest(CreateVacationRequest dto) {
        validateOwnership(dto.collaboratorId());
        validateDateRange(dto.startDate(), dto.endDate());
        validateNoOverlap(dto.startDate(), dto.endDate(), null);

        User collaborator = userRepository.findByIdAndActiveTrue(dto.collaboratorId())
                .orElseThrow(() -> new NotFoundException("Collaborator not found"));

        VacationRequest request = VacationRequest.builder()
                .collaborator(collaborator)
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .status(PENDING)
                .reason(dto.reason())
                .build();

        return toResponse(vacationRequestRepository.saveAndFlush(request));
    }

    @Transactional
    public VacationRequestResponse updateVacationRequest(UUID id, UpdateVacationRequest dto) {
        VacationRequest request = findOrThrow(id);
        checkCanEdit(request);
        validateDateRange(dto.startDate(), dto.endDate());
        validateNoOverlap(dto.startDate(), dto.endDate(), id);

        request.setStartDate(dto.startDate());
        request.setEndDate(dto.endDate());
        request.setReason(dto.reason());

        return toResponse(vacationRequestRepository.saveAndFlush(request));
    }

    @Transactional
    public VacationRequestResponse approveVacationRequest(UUID id) {
        VacationRequest request = findOrThrow(id);
        requirePending(request);
        checkCanReview(request);
        checkNotOwnRequest(request);
        validateNoOverlap(request.getStartDate(), request.getEndDate(), id);

        request.setStatus(APPROVED);
        request.setReviewedBy(actingUser());
        request.setReviewedAt(Instant.now());

        return toResponse(vacationRequestRepository.saveAndFlush(request));
    }

    @Transactional
    public VacationRequestResponse rejectVacationRequest(UUID id, RejectVacationRequest dto) {
        VacationRequest request = findOrThrow(id);
        requirePending(request);
        checkCanReview(request);
        checkNotOwnRequest(request);

        request.setStatus(REJECTED);
        request.setRejectionReason(dto.rejectionReason());
        request.setReviewedBy(actingUser());
        request.setReviewedAt(Instant.now());

        return toResponse(vacationRequestRepository.saveAndFlush(request));
    }

    @Transactional
    public void cancelVacationRequest(UUID id) {
        VacationRequest request = findOrThrow(id);
        requirePending(request);
        checkCanCancel(request);

        request.setStatus(CANCELLED);
        request.setCancelledAt(Instant.now());
        vacationRequestRepository.save(request);
    }

    // --- private helpers ---

    private void validateOwnership(UUID collaboratorId) {
        if (actingUserContext.isAdmin()) return;
        if (!actingUserContext.getActingUserId().equals(collaboratorId)) {
            throw new ForbiddenException("You can only create vacation requests for yourself");
        }
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate cannot be before startDate");
        }
    }

    private void validateNoOverlap(LocalDate startDate, LocalDate endDate, UUID excludeId) {
        boolean overlaps = excludeId == null
                ? vacationRequestRepository.existsOverlap(startDate, endDate, ACTIVE_STATUSES)
                : vacationRequestRepository.existsOverlapExcluding(startDate, endDate, ACTIVE_STATUSES, excludeId);

        if (overlaps) {
            throw new ConflictException("VACATION_OVERLAP",
                    "Vacation request overlaps with an existing active request.");
        }
    }

    private void checkCanView(VacationRequest request) {
        if (actingUserContext.isAdmin()) return;
        if (actingUserContext.isManager() && actingUserContext.manages(request.getCollaborator().getId())) return;
        if (actingUserContext.getActingUserId().equals(request.getCollaborator().getId())) return;
        throw new ForbiddenException("Access denied");
    }

    private void checkCanEdit(VacationRequest request) {
        requirePending(request);
        if (actingUserContext.isAdmin()) return;
        if (!actingUserContext.getActingUserId().equals(request.getCollaborator().getId())) {
            throw new ForbiddenException("You can only edit your own pending vacation requests");
        }
    }

    private void checkCanReview(VacationRequest request) {
        if (actingUserContext.isAdmin()) return;
        if (!actingUserContext.isManager()) {
            throw new ForbiddenException("Only managers and admins can approve or reject requests");
        }
        UUID collaboratorManagerId = request.getCollaborator().getManager() != null
                ? request.getCollaborator().getManager().getId() : null;
        if (!actingUserContext.getActingUserId().equals(collaboratorManagerId)) {
            throw new ForbiddenException("You can only review requests from your direct collaborators");
        }
    }

    private void checkCanCancel(VacationRequest request) {
        if (actingUserContext.isAdmin()) return;
        if (!actingUserContext.getActingUserId().equals(request.getCollaborator().getId())) {
            throw new ForbiddenException("You can only cancel your own vacation requests");
        }
    }

    private void checkNotOwnRequest(VacationRequest request) {
        if (actingUserContext.getActingUserId().equals(request.getCollaborator().getId())) {
            throw new ForbiddenException("You cannot approve or reject your own vacation request");
        }
    }

    private void requirePending(VacationRequest request) {
        if (request.getStatus() != PENDING) {
            throw new ConflictException("INVALID_STATUS",
                    "Only pending requests can be modified. Current status: " + request.getStatus());
        }
    }

    private User actingUser() {
        return userRepository.findByIdAndActiveTrue(actingUserContext.getActingUserId())
                .orElseThrow(() -> new NotFoundException("Acting user not found"));
    }

    private VacationRequest findOrThrow(UUID id) {
        return vacationRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vacation request not found"));
    }

    private VacationRequestResponse toResponse(VacationRequest vr) {
        User collaborator = vr.getCollaborator();
        User manager = collaborator.getManager();
        User reviewer = vr.getReviewedBy();

        return new VacationRequestResponse(
                vr.getId(),
                collaborator.getId(),
                collaborator.getName(),
                manager != null ? manager.getId() : null,
                manager != null ? manager.getName() : null,
                vr.getStartDate(),
                vr.getEndDate(),
                vr.getInclusiveDays(),
                vr.getStatus(),
                vr.getReason(),
                reviewer != null ? reviewer.getId() : null,
                reviewer != null ? reviewer.getName() : null,
                vr.getReviewedAt(),
                vr.getRejectionReason(),
                vr.getCancelledAt(),
                vr.getCreatedAt(),
                vr.getUpdatedAt()
        );
    }
}
