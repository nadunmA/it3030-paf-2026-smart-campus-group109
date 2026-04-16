package com.wegroup423.smart_campus.features.admin.service;

import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceTypeRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceTypeResponse;

import java.util.List;

public interface ResourceTypeService {
    ResourceTypeResponse createResourceType(CreateResourceTypeRequest request);

    ResourceTypeResponse getResourceType(String id);

    List<ResourceTypeResponse> getAllResourceTypes();

    List<ResourceTypeResponse> getDefaultResourceTypes();

    void deleteResourceType(String id);
}
