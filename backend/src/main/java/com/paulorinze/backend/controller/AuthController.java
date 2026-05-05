package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.MeResponse;
import com.paulorinze.backend.dto.MockUserResponse;
import com.paulorinze.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/mock-users")
    public List<MockUserResponse> getMockUsers() {
        return authService.getMockUsers();
    }

    @GetMapping("/me")
    public MeResponse getMe() {
        return authService.getMe();
    }
}
