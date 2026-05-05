package com.paulorinze.backend.repository;

import com.paulorinze.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByIdAndActiveTrue(UUID id);

    boolean existsByEmailAndIdNot(String email, UUID id);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "manager")
    List<User> findAllByOrderByNameAsc();

    List<User> findByManager_Id(UUID managerId);
}
