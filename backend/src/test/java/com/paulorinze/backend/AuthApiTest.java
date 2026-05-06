package com.paulorinze.backend;

import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthApiTest extends ApiTestSupport {

    @Test
    void missingActingUserHeader_returns401() throws Exception {
        mockMvc.perform(get("/api/vacation-requests"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidActingUserHeader_returns401() throws Exception {
        mockMvc.perform(get("/api/vacation-requests")
                        .header("X-Acting-User-Id", "not-a-valid-uuid"))
                .andExpect(status().isUnauthorized());
    }
}
