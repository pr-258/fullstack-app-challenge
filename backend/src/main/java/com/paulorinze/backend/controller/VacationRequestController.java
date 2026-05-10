package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.*;
import com.paulorinze.backend.enums.VacationRequestStatus;
import com.paulorinze.backend.service.VacationRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@Tag(name = "Vacation Requests", description = "Manage vacation requests — create, review, approve, reject and cancel")
@RestController
@RequestMapping("/api/vacation-requests")
@RequiredArgsConstructor
public class VacationRequestController {

    private final VacationRequestService vacationRequestService;

    @Operation(summary = "List vacation requests", description = "Returns a paginated list of vacation requests. Scope is automatically filtered by the acting user's role.")
    @GetMapping
    public PageResponse<VacationRequestResponse> listVacationRequests(
            @RequestParam(required = false) VacationRequestStatus status,
            @RequestParam(required = false) UUID collaboratorId,
            @RequestParam(required = false) UUID managerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return vacationRequestService.listVacationRequests(status, collaboratorId, managerId, startDate, endDate, search, pageable);
    }

    @Operation(summary = "Get vacation request by ID")
    @GetMapping("/{id}")
    public VacationRequestResponse getVacationRequestById(@PathVariable UUID id) {
        return vacationRequestService.getVacationRequestById(id);
    }

    @Operation(summary = "Create a vacation request", description = "Validates date range, overlap with existing PENDING/APPROVED requests, and ownership rules.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacationRequestResponse createVacationRequest(@Valid @RequestBody CreateVacationRequest request) {
        return vacationRequestService.createVacationRequest(request);
    }

    @Operation(summary = "Update a vacation request", description = "Only PENDING requests can be updated. Overlap validation is re-run.")
    @PutMapping("/{id}")
    public VacationRequestResponse updateVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVacationRequest request) {
        return vacationRequestService.updateVacationRequest(id, request);
    }

    @Operation(summary = "Approve a vacation request", description = "Only the collaborator's manager or an admin can approve. Self-approval is blocked.")
    @PostMapping("/{id}/approve")
    public VacationRequestResponse approveVacationRequest(@PathVariable UUID id) {
        return vacationRequestService.approveVacationRequest(id);
    }

    @Operation(summary = "Reject a vacation request", description = "A rejection reason is required. Only the collaborator's manager or an admin can reject.")
    @PostMapping("/{id}/reject")
    public VacationRequestResponse rejectVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody RejectVacationRequest request) {
        return vacationRequestService.rejectVacationRequest(id, request);
    }

    @Operation(summary = "Cancel a vacation request", description = "Only the owner of a PENDING request can cancel it.")
    @PostMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelVacationRequest(@PathVariable UUID id) {
        vacationRequestService.cancelVacationRequest(id);
    }
}
