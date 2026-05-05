package com.paulorinze.backend.service;

import com.paulorinze.backend.config.ActingUserContext;
import com.paulorinze.backend.dto.MeResponse;
import com.paulorinze.backend.dto.MockUserResponse;
import com.paulorinze.backend.entity.User;
import com.paulorinze.backend.enums.Role;
import com.paulorinze.backend.exception.NotFoundException;
import com.paulorinze.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ActingUserContext actingUserContext;

    public List<MockUserResponse> getMockUsers() {
        return userRepository.findAllByOrderByNameAsc().stream()
                .map(this::toMockUserResponse)
                .toList();
    }

    public MeResponse getMe() {
        User user = userRepository.findByIdAndActiveTrue(actingUserContext.getActingUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return new MeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                permissionsFor(user.getRole())
        );
    }

    private List<String> permissionsFor(Role role) {
        return switch (role) {
            case ADMIN -> List.of("USERS_MANAGE", "VACATIONS_MANAGE_ALL");
            case MANAGER -> List.of("VACATIONS_MANAGE_TEAM");
            case COLLABORATOR -> List.of("VACATIONS_MANAGE_OWN");
        };
    }

    private MockUserResponse toMockUserResponse(User user) {
        return new MockUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getManager() != null ? user.getManager().getName() : null
        );
    }
}
