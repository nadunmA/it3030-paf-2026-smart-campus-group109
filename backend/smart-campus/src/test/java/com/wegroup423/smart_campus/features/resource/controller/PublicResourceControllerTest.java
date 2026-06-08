package com.wegroup423.smart_campus.features.resource.controller;



import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import com.wegroup423.smart_campus.features.resources.controller.PublicResourceController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublicResourceControllerTest {

    @Mock
    private ResourceService resourceService;

    @InjectMocks
    private PublicResourceController publicResourceController;

    @Test
    void getResource_shouldReturnResource_whenValidIdProvided() {
        String resourceId = "res-123";

        ResourceResponse resourceResponse = mock(ResourceResponse.class);

        when(resourceService.getResource(resourceId)).thenReturn(resourceResponse);

        ResponseEntity<ResourceResponse> response =
                publicResourceController.getResource(resourceId);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertSame(resourceResponse, response.getBody());

        verify(resourceService).getResource(resourceId);
    }

    @Test
    void getResourceByQrCode_shouldReturnResource_whenValidQrCodeProvided() {
        String qrCode = "QR-ABC-123";

        ResourceResponse resourceResponse = mock(ResourceResponse.class);

        when(resourceService.getResourceByQrCode(qrCode)).thenReturn(resourceResponse);

        ResponseEntity<ResourceResponse> response =
                publicResourceController.getResourceByQrCode(qrCode);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertSame(resourceResponse, response.getBody());

        verify(resourceService).getResourceByQrCode(qrCode);
    }
}