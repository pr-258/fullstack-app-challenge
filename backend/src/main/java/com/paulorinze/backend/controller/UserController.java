package com.paulorinze.backend.controller;

import com.paulorinze.backend.dto.PageResponse;
import com.paulorinze.backend.dto.UserRequest;
import com.paulorinze.backend.dto.UserResponse;
import com.paulorinze.backend.enums.Role;
import com.paulorinze.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Users", description = "Manage collaborators — admin-only create, update and delete operations")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "List users", description = "Returns a paginated list of users. Supports filtering by role, managerId and search term.")
    @GetMapping
    public PageResponse<UserResponse> listUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UUID managerId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        return userService.listUsers(role, managerId, search, pageable);
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @Operation(summary = "Create a user", description = "Admin only. Collaborators must have a managerId. Email must be unique.")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @Operation(summary = "Update a user", description = "Admin only. Role and manager can be changed. Email uniqueness is re-validated.")
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        return userService.updateUser(id, request);
    }

    @Operation(summary = "Delete a user", description = "Admin only. Managers with active collaborators cannot be deleted.")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }
}
