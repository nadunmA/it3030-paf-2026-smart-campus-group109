package com.wegroup423.smart_campus.features.admin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import com.wegroup423.smart_campus.features.auth.security.CustomOAuth2UserService;
import com.wegroup423.smart_campus.features.auth.security.JwtAuthFilter;
import com.wegroup423.smart_campus.features.auth.security.OAuth2SuccessHandler;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ResourceController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceService resourceService;

        @MockBean
        private JwtAuthFilter jwtAuthFilter;

        @MockBean
        private CustomOAuth2UserService customOAuth2UserService;

        @MockBean
        private OAuth2SuccessHandler oAuth2SuccessHandler;

    private ResourceResponse sampleResponse() {
        return new ResourceResponse(
                "R-1",
                "Lecture Hall A",
                "TYPE-1",
                "LECTURE_HALL",
                "Building A",
                120,
                "AVAILABLE",
                15000.0,
                LocalDate.now().plusYears(2),
                "tech-1",
                "Tech One",
                "SN-123",
                "GOOD",
                LocalDate.now().plusMonths(3),
                "RESOURCE_QR_1",
                Instant.now(),
                Instant.now()
        );
    }

    @Test
    void createResource_returnsCreated() throws Exception {
        CreateResourceRequest request = new CreateResourceRequest(
                "Lecture Hall A",
                "TYPE-1",
                "Building A",
                120,
                15000.0,
                LocalDate.now().plusYears(2),
                "tech-1",
                "SN-123",
                "GOOD",
                LocalDate.now().plusMonths(3)
        );

        when(resourceService.createResource(any(CreateResourceRequest.class))).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/admin/facilities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("R-1"))
                .andExpect(jsonPath("$.name").value("Lecture Hall A"));
    }

    @Test
    void getAllResources_returnsPage() throws Exception {
        when(resourceService.getAllResources(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(sampleResponse())));

        mockMvc.perform(get("/api/admin/facilities")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value("R-1"));
    }

    @Test
    void searchResources_returnsFilteredList() throws Exception {
        when(resourceService.searchResources(eq("TYPE-1"), eq("Building"), eq("AVAILABLE"), eq(null)))
                .thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/admin/facilities/search")
                        .param("type", "TYPE-1")
                        .param("location", "Building")
                        .param("availability", "AVAILABLE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].resourceTypeId").value("TYPE-1"));
    }

    @Test
    void updateResource_returnsUpdated() throws Exception {
        UpdateResourceRequest request = new UpdateResourceRequest(
                "Lecture Hall A Updated",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "EXCELLENT",
                null,
                "AVAILABLE"
        );

        ResourceResponse updated = sampleResponse();
        when(resourceService.updateResource(eq("R-1"), any(UpdateResourceRequest.class))).thenReturn(updated);

        mockMvc.perform(patch("/api/admin/facilities/R-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("R-1"));
    }

    @Test
    void deleteResource_returnsNoContent() throws Exception {
        doNothing().when(resourceService).deleteResource("R-1");

        mockMvc.perform(delete("/api/admin/facilities/R-1"))
                .andExpect(status().isNoContent());
    }
}
