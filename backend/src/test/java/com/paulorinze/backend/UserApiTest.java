package com.paulorinze.backend;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserApiTest extends ApiTestSupport {

    @Test
    void admin_canCreateUser_returns201() throws Exception {
        String body = """
            {
              "name": "Test User",
              "email": "test+%s@example.com",
              "role": "COLLABORATOR",
              "managerId": "%s"
            }
            """.formatted(UUID.randomUUID(), BRUNO);

        mockMvc.perform(post("/api/users")
                        .header("X-Acting-User-Id", ANA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void nonAdmin_cannotCreateUser_returns403() throws Exception {
        String body = """
            {
              "name": "Sneaky User",
              "email": "sneaky@example.com",
              "role": "COLLABORATOR",
              "managerId": "%s"
            }
            """.formatted(BRUNO);

        mockMvc.perform(post("/api/users")
                        .header("X-Acting-User-Id", DIEGO)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void createCollaborator_withoutManager_returns422() throws Exception {
        String body = """
            {
              "name": "No Manager",
              "email": "nomanager@example.com",
              "role": "COLLABORATOR"
            }
            """;

        mockMvc.perform(post("/api/users")
                        .header("X-Acting-User-Id", ANA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity());
    }
}
