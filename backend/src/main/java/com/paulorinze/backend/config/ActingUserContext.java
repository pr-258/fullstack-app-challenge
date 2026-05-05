package com.paulorinze.backend.config;

import com.paulorinze.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Set;
import java.util.UUID;

@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Getter
@Setter
public class ActingUserContext {

    private UUID actingUserId;
    private Role role;
    private Set<UUID> managedCollaboratorIds = Set.of();

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }

    public boolean isManager() {
        return role == Role.MANAGER;
    }

    public boolean isCollaborator() {
        return role == Role.COLLABORATOR;
    }

    public boolean manages(UUID userId) {
        return managedCollaboratorIds.contains(userId);
    }
}
