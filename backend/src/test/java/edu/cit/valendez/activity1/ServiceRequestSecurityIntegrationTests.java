package edu.cit.valendez.activity1;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.valendez.activity1.dto.ServiceRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class ServiceRequestSecurityIntegrationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private String userAToken;
    private String userBToken;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        serviceRequestRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Register User A
        User userA = new User("userA", "PasswordA123");
        mockMvc.perform(post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userA)))
                .andExpect(status().isOk());

        // 2. Register User B
        User userB = new User("userB", "PasswordB123");
        mockMvc.perform(post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userB)))
                .andExpect(status().isOk());

        // 3. Login User A
        MvcResult loginAResult = mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userA)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode jsonA = objectMapper.readTree(loginAResult.getResponse().getContentAsString());
        userAToken = jsonA.get("token").asText();

        // 4. Login User B
        MvcResult loginBResult = mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userB)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode jsonB = objectMapper.readTree(loginBResult.getResponse().getContentAsString());
        userBToken = jsonB.get("token").asText();
    }

    @Test
    void testFullCrudAndOwnershipEnforcement() throws Exception {
        // 1. Unauthenticated request to /api/requests should be rejected
        mockMvc.perform(get("/api/requests"))
                .andExpect(status().isForbidden());

        // 2. User A creates Service Request #1
        ServiceRequestDto createDto = new ServiceRequestDto(
                "Network Connectivity Issue",
                "Cannot connect to office Wi-Fi in building 2",
                "Network"
        );

        MvcResult createResult = mockMvc.perform(post("/api/requests")
                .header("Authorization", "Bearer " + userAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Network Connectivity Issue")))
                .andExpect(jsonPath("$.category", is("Network")))
                .andExpect(jsonPath("$.createdBy", is("userA")))
                .andReturn();

        JsonNode createdNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        long requestId = createdNode.get("id").asLong();

        // 3. User A retrieves own requests list
        mockMvc.perform(get("/api/requests")
                .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is((int) requestId)))
                .andExpect(jsonPath("$[0].createdBy", is("userA")));

        // 4. User A gets own request by ID
        mockMvc.perform(get("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is((int) requestId)))
                .andExpect(jsonPath("$.title", is("Network Connectivity Issue")));

        // 5. User A updates own request
        ServiceRequestDto updateDto = new ServiceRequestDto(
                "Network Connectivity Issue - Resolved with IT",
                "Updated description: Wi-Fi connected",
                "Network"
        );

        mockMvc.perform(put("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Network Connectivity Issue - Resolved with IT")));

        // ==========================================
        // SECURITY / OWNERSHIP CHECKS (USER B VIOLATIONS)
        // ==========================================

        // 6. User B attempts to view User A's request -> Must be 403 Forbidden
        mockMvc.perform(get("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());

        // 7. User B attempts to update User A's request -> Must be 403 Forbidden
        ServiceRequestDto maliciousUpdate = new ServiceRequestDto("Hacked", "Hacked", "Hardware");
        mockMvc.perform(put("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userBToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(maliciousUpdate)))
                .andExpect(status().isForbidden());

        // 8. User B attempts to delete User A's request -> Must be 403 Forbidden
        mockMvc.perform(delete("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());

        // 9. User B's list should be empty
        mockMvc.perform(get("/api/requests")
                .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // 10. User A deletes own request -> Success
        mockMvc.perform(delete("/api/requests/" + requestId)
                .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Service request deleted successfully")));

        // 11. User A's list is now empty
        mockMvc.perform(get("/api/requests")
                .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}

