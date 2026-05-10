package com.paulorinze.backend;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class VacationRequestApiTest extends ApiTestSupport {

    @Test
    void collaborator_listRequests_seesOnlyOwn() throws Exception {
        mockMvc.perform(get("/api/vacation-requests")
                        .header("X-Acting-User-Id", DIEGO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[*].collaboratorId", everyItem(is(DIEGO))));
    }

    @Test
    void manager_listRequests_seesOnlyOwnTeam() throws Exception {
        mockMvc.perform(get("/api/vacation-requests")
                        .header("X-Acting-User-Id", BRUNO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[*].collaboratorId", not(hasItem(FIONA))));
    }

    @Test
    void manager_cannotApprove_anotherManagersTeamRequest_returns403() throws Exception {
        mockMvc.perform(post("/api/vacation-requests/{id}/approve", VAC_REQ_1)
                        .header("X-Acting-User-Id", CARLOS))
                .andExpect(status().isForbidden());
    }

    @Test
    void manager_approvesOwnCollaboratorPendingRequest_succeeds() throws Exception {
        String requestId = createVacationRequest(
                DIEGO,
                DIEGO,
                "2027-01-10",
                "2027-01-12",
                "Manager approval happy path"
        );

        mockMvc.perform(post("/api/vacation-requests/{id}/approve", requestId)
                        .header("X-Acting-User-Id", BRUNO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.reviewedById").value(BRUNO));
    }

    @Test
    void manager_rejectsOwnCollaboratorPendingRequest_succeeds() throws Exception {
        String requestId = createVacationRequest(
                DIEGO,
                DIEGO,
                "2027-01-20",
                "2027-01-21",
                "Manager rejection happy path"
        );

        String body = """
            {
              "rejectionReason": "Team coverage not available"
            }
            """;

        mockMvc.perform(post("/api/vacation-requests/{id}/reject", requestId)
                        .header("X-Acting-User-Id", BRUNO)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"))
                .andExpect(jsonPath("$.reviewedById").value(BRUNO))
                .andExpect(jsonPath("$.rejectionReason").value("Team coverage not available"));
    }

    @Test
    void collaborator_editsOwnPendingVacationRequest_succeeds() throws Exception {
        String requestId = createVacationRequest(
                EVA,
                EVA,
                "2027-02-01",
                "2027-02-02",
                "Original dates"
        );

        String body = """
            {
              "startDate": "2027-02-03",
              "endDate": "2027-02-05",
              "reason": "Updated dates"
            }
            """;

        mockMvc.perform(put("/api/vacation-requests/{id}", requestId)
                        .header("X-Acting-User-Id", EVA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startDate").value("2027-02-03"))
                .andExpect(jsonPath("$.endDate").value("2027-02-05"))
                .andExpect(jsonPath("$.inclusiveDays").value(3))
                .andExpect(jsonPath("$.reason").value("Updated dates"));
    }

    @Test
    void collaborator_cancelsOwnPendingVacationRequest_succeeds() throws Exception {
        String requestId = createVacationRequest(
                EVA,
                EVA,
                "2027-02-10",
                "2027-02-11",
                "Cancellation happy path"
        );

        mockMvc.perform(post("/api/vacation-requests/{id}/cancel", requestId)
                        .header("X-Acting-User-Id", EVA))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/vacation-requests/{id}", requestId)
                        .header("X-Acting-User-Id", EVA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"))
                .andExpect(jsonPath("$.cancelledAt").isNotEmpty());
    }

    @Test
    void createVacationRequest_endDateBeforeStartDate_returns422() throws Exception {
        String body = """
            {
              "collaboratorId": "%s",
              "startDate": "2026-10-10",
              "endDate": "2026-10-05",
              "reason": "Time travel"
            }
            """.formatted(DIEGO);

        mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", DIEGO)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void vacationRequest_inclusiveDayCount_isCorrect() throws Exception {
        mockMvc.perform(get("/api/vacation-requests/{id}", VAC_REQ_1)
                        .header("X-Acting-User-Id", DIEGO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.inclusiveDays").value(5));
    }

    @Test
    void createVacationRequest_overlappingActivePending_returns409() throws Exception {
        String body = """
            {
              "collaboratorId": "%s",
              "startDate": "2026-08-01",
              "endDate": "2026-08-05",
              "reason": "Should be blocked"
            }
            """.formatted(EVA);

        mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", EVA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("VACATION_OVERLAP"));
    }

    @Test
    void createVacationRequest_overlappingRejectedRequest_succeeds() throws Exception {
        String rejectedRequestBody = """
            {
              "collaboratorId": "%s",
              "startDate": "2026-12-10",
              "endDate": "2026-12-12",
              "reason": "Will be rejected"
            }
            """.formatted(FIONA);

        MvcResult rejectedRequestResult = mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", FIONA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rejectedRequestBody))
                .andExpect(status().isCreated())
                .andReturn();

        String rejectedRequestId = objectMapper.readTree(rejectedRequestResult.getResponse().getContentAsString())
                .get("id")
                .asText();

        String rejectionBody = """
            {
              "rejectionReason": "Team coverage not available"
            }
            """;

        mockMvc.perform(post("/api/vacation-requests/{id}/reject", rejectedRequestId)
                        .header("X-Acting-User-Id", CARLOS)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rejectionBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));

        String body = """
            {
              "collaboratorId": "%s",
              "startDate": "2026-12-11",
              "endDate": "2026-12-12",
              "reason": "Should be allowed"
            }
            """.formatted(EVA);

        mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", EVA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());
    }

    @Test
    void approveNonPendingRequest_returns409() throws Exception {
        mockMvc.perform(post("/api/vacation-requests/{id}/approve", VAC_REQ_3)
                        .header("X-Acting-User-Id", ANA))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("INVALID_STATUS"));
    }

    @Test
    void user_cannotApproveOwnVacationRequest_returns403() throws Exception {
        String createBody = """
            {
              "collaboratorId": "%s",
              "startDate": "2027-01-01",
              "endDate": "2027-01-05",
              "reason": "Self-approval attempt"
            }
            """.formatted(ANA);

        MvcResult result = mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", ANA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn();

        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(post("/api/vacation-requests/{id}/approve", id)
                        .header("X-Acting-User-Id", ANA))
                .andExpect(status().isForbidden());
    }

    private String createVacationRequest(
            String actingUserId,
            String collaboratorId,
            String startDate,
            String endDate,
            String reason) throws Exception {
        String body = """
            {
              "collaboratorId": "%s",
              "startDate": "%s",
              "endDate": "%s",
              "reason": "%s"
            }
            """.formatted(collaboratorId, startDate, endDate, reason);

        MvcResult result = mockMvc.perform(post("/api/vacation-requests")
                        .header("X-Acting-User-Id", actingUserId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }
}
