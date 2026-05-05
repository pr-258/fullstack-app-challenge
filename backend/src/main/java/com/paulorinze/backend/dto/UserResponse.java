package com.paulorinze.backend.dto;

import com.paulorinze.backend.enums.Role;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        UUID managerId,
        String managerName,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
