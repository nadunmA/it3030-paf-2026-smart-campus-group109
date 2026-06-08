package com.wegroup423.smart_campus.features.resource.controller;



import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import com.wegroup423.smart_campus.features.resources.controller.ResourceApiController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceApiControllerTest {

    @Mock
    private ResourceService resourceService;

    @InjectMocks
    private ResourceApiController controller;

    @Test
    void createResource_shouldReturnCreated() {
        CreateResourceRequest request = mock(CreateResourceRequest.class);
        ResourceResponse responseObj = mock(ResourceResponse.class);

        when(resourceService.createResource(request)).thenReturn(responseObj);

        ResponseEntity<ResourceResponse> response = controller.createResource(request);

        assertEquals(201, response.getStatusCode().value());
        assertSame(responseObj, response.getBody());

        verify(resourceService).createResource(request);
    }

    @Test
    void getResources_shouldReturnList() {
        List<ResourceResponse> list = List.of(mock(ResourceResponse.class));

        when(resourceService.searchResources("lab", "Colombo", null, 50))
                .thenReturn(list);

        ResponseEntity<List<ResourceResponse>> response =
                controller.getResources("lab", "Colombo", 50);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(list, response.getBody());

        verify(resourceService).searchResources("lab", "Colombo", null, 50);
    }

    @Test
    void getResource_shouldReturnSingle() {
        ResourceResponse res = mock(ResourceResponse.class);

        when(resourceService.getResource("id1")).thenReturn(res);

        ResponseEntity<ResourceResponse> response = controller.getResource("id1");

        assertEquals(200, response.getStatusCode().value());
        assertSame(res, response.getBody());

        verify(resourceService).getResource("id1");
    }

    @Test
    void getResourceByQrCode_shouldReturnResource() {
        ResourceResponse res = mock(ResourceResponse.class);

        when(resourceService.getResourceByQrCode("QR1")).thenReturn(res);

        ResponseEntity<ResourceResponse> response =
                controller.getResourceByQrCode("QR1");

        assertEquals(200, response.getStatusCode().value());
        assertSame(res, response.getBody());

        verify(resourceService).getResourceByQrCode("QR1");
    }

    @Test
    void updateResource_shouldReturnUpdated() {
        UpdateResourceRequest request = mock(UpdateResourceRequest.class);
        ResourceResponse res = mock(ResourceResponse.class);

        when(resourceService.updateResource("id1", request)).thenReturn(res);

        ResponseEntity<ResourceResponse> response =
                controller.updateResource("id1", request);

        assertEquals(200, response.getStatusCode().value());
        assertSame(res, response.getBody());

        verify(resourceService).updateResource("id1", request);
    }

    @Test
    void deleteResource_shouldReturnNoContent() {
        doNothing().when(resourceService).deleteResource("id1");

        ResponseEntity<Void> response = controller.deleteResource("id1");

        assertEquals(204, response.getStatusCode().value());

        verify(resourceService).deleteResource("id1");
    }

    @Test
    void exportResourcesCsv_shouldReturnCsvFile() {
        when(resourceService.exportResourcesAsCsv(
                null, null, null, null, null, null))
                .thenReturn("id,name\n1,Lab");

        ResponseEntity<byte[]> response =
                controller.exportResourcesCsv(
                        null, null, null,
                        null, null, null);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getHeaders().get("Content-Disposition"));
        assertNotNull(response.getBody());

        verify(resourceService).exportResourcesAsCsv(
                null, null, null, null, null, null);
    }
}