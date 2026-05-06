package com.paulorinze.backend.repository;

import com.paulorinze.backend.entity.VacationRequest;
import com.paulorinze.backend.enums.VacationRequestStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class VacationRequestSpecification {

    private VacationRequestSpecification() {}

    public static Specification<VacationRequest> withFilters(
            VacationRequestStatus status,
            UUID collaboratorId,
            UUID managerId,
            LocalDate startDate,
            LocalDate endDate,
            String search) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (collaboratorId != null) {
                predicates.add(cb.equal(root.get("collaborator").get("id"), collaboratorId));
            }
            if (managerId != null) {
                predicates.add(cb.equal(root.get("collaborator").get("manager").get("id"), managerId));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), endDate));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("collaborator").get("name")), pattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<VacationRequest> forCollaborator(UUID collaboratorId) {
        return (root, query, cb) -> cb.equal(root.get("collaborator").get("id"), collaboratorId);
    }

    public static Specification<VacationRequest> forManager(UUID managerId) {
        return (root, query, cb) -> cb.equal(root.get("collaborator").get("manager").get("id"), managerId);
    }
}
