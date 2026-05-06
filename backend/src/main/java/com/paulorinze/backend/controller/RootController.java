package com.paulorinze.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
                "name", "Vacation Management API",
                "status", "running",
                "swaggerUrl", "/swagger-ui.html",
                "mockUsersUrl", "/api/auth/mock-users"
        );
    }
}
