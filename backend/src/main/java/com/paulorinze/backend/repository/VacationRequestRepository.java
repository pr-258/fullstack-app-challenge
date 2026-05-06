package com.paulorinze.backend.repository;

import com.paulorinze.backend.entity.VacationRequest;
import com.paulorinze.backend.enums.VacationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface VacationRequestRepository extends JpaRepository<VacationRequest, UUID>, JpaSpecificationExecutor<VacationRequest> {

    @Query("""
            SELECT COUNT(vr) > 0 FROM VacationRequest vr
            WHERE vr.status IN :statuses
            AND vr.startDate <= :endDate
            AND vr.endDate >= :startDate
            """)
    boolean existsOverlap(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<VacationRequestStatus> statuses);

    @Query("""
            SELECT COUNT(vr) > 0 FROM VacationRequest vr
            WHERE vr.status IN :statuses
            AND vr.startDate <= :endDate
            AND vr.endDate >= :startDate
            AND vr.id <> :excludeId
            """)
    boolean existsOverlapExcluding(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<VacationRequestStatus> statuses,
            @Param("excludeId") UUID excludeId);
}
