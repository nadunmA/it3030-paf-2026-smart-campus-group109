package com.wegroup423.smart_campus.features.admin.service.impl;

import com.wegroup423.smart_campus.features.admin.exception.ResourceTypeNotFoundException;
import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceTypeRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceTypeResponse;
import com.wegroup423.smart_campus.features.admin.model.entity.ResourceType;
import com.wegroup423.smart_campus.features.admin.repository.ResourceTypeRepository;
import com.wegroup423.smart_campus.features.admin.service.ResourceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceTypeServiceImpl implements ResourceTypeService {

    private final ResourceTypeRepository resourceTypeRepository;

    @Override
    public ResourceTypeResponse createResourceType(CreateResourceTypeRequest request) {
        ResourceType resourceType = ResourceType.builder()
                .name(request.name())
                .description(request.description())
                .isDefault(false)
                .createdAt(LocalDateTime.now())
                .build();

        ResourceType saved = resourceTypeRepository.save(resourceType);
        return toResponse(saved);
    }

    @Override
    public ResourceTypeResponse getResourceType(String id) {
        ResourceType resourceType = resourceTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceTypeNotFoundException("ResourceType not found with id: " + id));
        return toResponse(resourceType);
    }

    @Override
    public List<ResourceTypeResponse> getAllResourceTypes() {
        return resourceTypeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceTypeResponse> getDefaultResourceTypes() {
        return resourceTypeRepository.findByIsDefault(true)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteResourceType(String id) {
        ResourceType resourceType = resourceTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceTypeNotFoundException("ResourceType not found with id: " + id));

        if (resourceType.isDefault()) {
            throw new IllegalArgumentException("Cannot delete default resource types");
        }

        resourceTypeRepository.deleteById(id);
    }

    private ResourceTypeResponse toResponse(ResourceType resourceType) {
        return new ResourceTypeResponse(
                resourceType.getId(),
                resourceType.getName(),
                resourceType.getDescription(),
                resourceType.isDefault()
        );
    }
}
