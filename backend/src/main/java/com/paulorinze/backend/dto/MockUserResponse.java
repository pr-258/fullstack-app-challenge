package com.paulorinze.backend.dto;

import com.paulorinze.backend.enums.Role;

import java.util.UUID;

public record MockUserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        UUID managerId,
        String managerName
) {}
