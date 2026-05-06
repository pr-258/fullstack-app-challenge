package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.*;
import com.paulorinze.backend.enums.VacationRequestStatus;
import com.paulorinze.backend.service.VacationRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/vacation-requests")
@RequiredArgsConstructor
public class VacationRequestController {

    private final VacationRequestService vacationRequestService;

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

    @GetMapping("/{id}")
    public VacationRequestResponse getVacationRequestById(@PathVariable UUID id) {
        return vacationRequestService.getVacationRequestById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacationRequestResponse createVacationRequest(@Valid @RequestBody CreateVacationRequest request) {
        return vacationRequestService.createVacationRequest(request);
    }

    @PutMapping("/{id}")
    public VacationRequestResponse updateVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVacationRequest request) {
        return vacationRequestService.updateVacationRequest(id, request);
    }

    @PostMapping("/{id}/approve")
    public VacationRequestResponse approveVacationRequest(@PathVariable UUID id) {
        return vacationRequestService.approveVacationRequest(id);
    }

    @PostMapping("/{id}/reject")
    public VacationRequestResponse rejectVacationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody RejectVacationRequest request) {
        return vacationRequestService.rejectVacationRequest(id, request);
    }

    @PostMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelVacationRequest(@PathVariable UUID id) {
        vacationRequestService.cancelVacationRequest(id);
    }
}
