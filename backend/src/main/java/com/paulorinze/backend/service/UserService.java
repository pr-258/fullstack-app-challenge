package com.paulorinze.backend.service;

import com.paulorinze.backend.config.ActingUserContext;
import com.paulorinze.backend.dto.PageResponse;
import com.paulorinze.backend.dto.UserRequest;
import com.paulorinze.backend.dto.UserResponse;
import com.paulorinze.backend.entity.User;
import com.paulorinze.backend.enums.Role;
import com.paulorinze.backend.exception.ConflictException;
import com.paulorinze.backend.exception.ForbiddenException;
import com.paulorinze.backend.exception.NotFoundException;
import com.paulorinze.backend.repository.UserRepository;
import com.paulorinze.backend.repository.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final ActingUserContext actingUserContext;

    public PageResponse<UserResponse> listUsers(Role role, UUID managerId, String search, Pageable pageable) {
        if (actingUserContext.isCollaborator()) {
            throw new ForbiddenException("Collaborators cannot list users");
        }

        UUID effectiveManagerId = managerId;
        if (actingUserContext.isManager()) {
            effectiveManagerId = actingUserContext.getActingUserId();
        }

        Specification<User> spec = UserSpecification.withFilters(role, effectiveManagerId, search);
        return PageResponse.from(userRepository.findAll(spec, pageable).map(this::toResponse));
    }

    public UserResponse getUserById(UUID id) {
        User user = findActiveOrThrow(id);
        checkCanViewUser(user);
        return toResponse(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        requireAdmin();
        validateUserRequest(request, null);

        User manager = resolveManager(request);

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .role(request.role())
                .manager(manager)
                .active(true)
                .build();

        return toResponse(userRepository.saveAndFlush(user));
    }

    @Transactional
    public UserResponse updateUser(UUID id, UserRequest request) {
        requireAdmin();
        User user = findActiveOrThrow(id);
        validateUserRequest(request, id);

        User manager = resolveManager(request);

        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(request.role());
        user.setManager(manager);

        return toResponse(userRepository.saveAndFlush(user));
    }

    @Transactional
    public void deleteUser(UUID id) {
        requireAdmin();
        User user = findActiveOrThrow(id);

        boolean hasCollaborators = !userRepository.findByManager_Id(id).isEmpty();
        if (hasCollaborators) {
            throw new ConflictException("MANAGER_HAS_COLLABORATORS",
                    "Cannot delete a manager with assigned collaborators");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    private void checkCanViewUser(User target) {
        if (actingUserContext.isAdmin()) return;

        UUID actingId = actingUserContext.getActingUserId();

        if (actingUserContext.isManager()) {
            boolean isSelf = target.getId().equals(actingId);
            boolean isDirectReport = actingUserContext.manages(target.getId());
            if (!isSelf && !isDirectReport) {
                throw new ForbiddenException("Access denied");
            }
            return;
        }

        if (!target.getId().equals(actingId)) {
            throw new ForbiddenException("Access denied");
        }
    }

    private void requireAdmin() {
        if (!actingUserContext.isAdmin()) {
            throw new ForbiddenException("Only admins can perform this action");
        }
    }

    private void validateUserRequest(UserRequest request, UUID excludeId) {
        boolean emailTaken = excludeId == null
                ? userRepository.existsByEmail(request.email())
                : userRepository.existsByEmailAndIdNot(request.email(), excludeId);

        if (emailTaken) {
            throw new ConflictException("EMAIL_CONFLICT", "Email is already in use");
        }

        if (request.role() == Role.COLLABORATOR && request.managerId() == null) {
            throw new IllegalArgumentException("managerId is required for collaborators");
        }
    }

    private User resolveManager(UserRequest request) {
        if (request.managerId() == null) return null;

        User manager = userRepository.findByIdAndActiveTrue(request.managerId())
                .orElseThrow(() -> new NotFoundException("Manager not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new IllegalArgumentException("The specified manager does not have the MANAGER role");
        }

        return manager;
    }

    private User findActiveOrThrow(UUID id) {
        return userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getManager() != null ? user.getManager().getName() : null,
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
