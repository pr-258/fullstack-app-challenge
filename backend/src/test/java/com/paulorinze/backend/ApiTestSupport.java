package com.paulorinze.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
abstract class ApiTestSupport {

    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    static {
        postgres.start();
    }

    @DynamicPropertySource
    static void configurePostgres(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    protected static final String ANA = "00000000-0000-0000-0000-000000000001";
    protected static final String BRUNO = "00000000-0000-0000-0000-000000000002";
    protected static final String CARLOS = "00000000-0000-0000-0000-000000000003";
    protected static final String DIEGO = "00000000-0000-0000-0000-000000000004";
    protected static final String EVA = "00000000-0000-0000-0000-000000000005";
    protected static final String FIONA = "00000000-0000-0000-0000-000000000006";

    protected static final String VAC_REQ_1 = "00000000-0000-0000-0001-000000000001";
    protected static final String VAC_REQ_3 = "00000000-0000-0000-0001-000000000003";

    @Autowired
    WebApplicationContext context;

    protected final ObjectMapper objectMapper = new ObjectMapper();

    protected MockMvc mockMvc;

    @BeforeAll
    void setUpMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }
}
