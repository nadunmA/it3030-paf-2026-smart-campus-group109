package com.wegroup423.smart_campus.features.admin.service;

import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceService {
    ResourceResponse createResource(CreateResourceRequest request);

    ResourceResponse getResource(String id);

    ResourceResponse getResourceByQrCode(String qrCode);

    Page<ResourceResponse> getAllResources(Pageable pageable);

    ResourceResponse updateResource(String id, UpdateResourceRequest request);

    ResourceResponse updateResourceStatus(String id, String status);

    void deleteResource(String id);

    List<ResourceResponse> searchResources(String type, String location, String availability, Integer capacity);

    List<ResourceResponse> getResourcesByType(String typeId);

    List<ResourceResponse> getResourcesByLocation(String location);

    List<ResourceResponse> getAssignedResources(String technicianId);

    String exportResourcesAsCsv(String type, String location, Integer capacity);
}
