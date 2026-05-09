package com.paulorinze.backend.config;

import com.paulorinze.backend.entity.User;
import com.paulorinze.backend.enums.Role;
import com.paulorinze.backend.exception.UnauthorizedException;
import com.paulorinze.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ActingUserInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;
    private final ActingUserContext actingUserContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("X-Acting-User-Id");

        if (header == null || header.isBlank()) {
            throw new UnauthorizedException("X-Acting-User-Id header is required");
        }

        UUID userId;
        try {
            userId = UUID.fromString(header);
        } catch (IllegalArgumentException e) {
            throw new UnauthorizedException("X-Acting-User-Id is not a valid UUID");
        }

        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new UnauthorizedException("Acting user not found or inactive"));

        actingUserContext.setActingUserId(user.getId());
        actingUserContext.setRole(user.getRole());

        if (user.getRole() == Role.MANAGER) {
            Set<UUID> managedIds = userRepository.findByManager_Id(user.getId())
                    .stream().map(User::getId).collect(Collectors.toSet());
            actingUserContext.setManagedCollaboratorIds(managedIds);
        }

        return true;
    }
}
