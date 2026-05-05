package com.paulorinze.backend.dto;

import com.paulorinze.backend.enums.Role;

import java.util.List;
import java.util.UUID;

public record MeResponse(
        UUID id,
        String name,
        String email,
        Role role,
        List<String> permissions
) {}
