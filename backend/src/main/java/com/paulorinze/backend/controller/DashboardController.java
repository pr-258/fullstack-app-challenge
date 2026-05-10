package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.DashboardStatsResponse;
import com.paulorinze.backend.service.VacationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final VacationRequestService vacationRequestService;

    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return vacationRequestService.getDashboardStats();
    }
}
