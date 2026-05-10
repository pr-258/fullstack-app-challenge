package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.DashboardStatsResponse;
import com.paulorinze.backend.service.VacationRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard", description = "Aggregated statistics scoped by the acting user's role")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final VacationRequestService vacationRequestService;

    @Operation(summary = "Get dashboard statistics", description = "Returns counts of vacation requests by status. Scope is automatically filtered by acting user's role.")
    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return vacationRequestService.getDashboardStats();
    }
}
