package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.MeResponse;
import com.paulorinze.backend.dto.MockUserResponse;
import com.paulorinze.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Auth", description = "Mock authentication — select an acting user to simulate login")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "List mock users", description = "Returns all active users available for login selection in the frontend.")
    @GetMapping("/mock-users")
    public List<MockUserResponse> getMockUsers() {
        return authService.getMockUsers();
    }

    @Operation(summary = "Get current user with permissions", description = "Returns the acting user's profile and computed permission flags based on their role.")
    @GetMapping("/me")
    public MeResponse getMe() {
        return authService.getMe();
    }
}
