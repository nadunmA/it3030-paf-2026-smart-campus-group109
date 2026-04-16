package com.wegroup423.smart_campus.features.admin.service.impl;

import com.wegroup423.smart_campus.features.admin.exception.ResourceNotFoundException;
import com.wegroup423.smart_campus.features.admin.exception.ResourceTypeNotFoundException;
import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.entity.ResourceType;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceCondition;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceStatus;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.admin.repository.ResourceTypeRepository;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final UserRepository userRepository;

    @Override
    public ResourceResponse createResource(CreateResourceRequest request) {
        // Validate resource type exists
        ResourceType resourceType = resolveResourceType(request.resourceTypeId(), request.type());

        // Validate assigned technician exists if provided
        String technicianName = null;
        if (request.assignedTechnicianId() != null) {
            User technician = userRepository.findById(request.assignedTechnicianId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Technician not found with id: " + request.assignedTechnicianId()));
            technicianName = technician.getName();
        }

        // Generate QR code (simple UUID-based approach)
        String qrCode = "RESOURCE_" + UUID.randomUUID().toString();

        Resource resource = Resource.builder()
                .name(request.name())
            .type(resourceType.getName())
            .description(request.description())
            .resourceTypeId(resourceType.getId())
                .location(request.location())
                .capacity(request.capacity())
            .availabilityStart(request.availabilityStart())
            .availabilityEnd(request.availabilityEnd())
                .cost(request.cost())
                .warrantyExpiry(request.warrantyExpiry())
                .assignedTechnicianId(request.assignedTechnicianId())
                .serialNumber(request.serialNumber())
                .condition(request.condition() != null ? 
                        ResourceCondition.valueOf(request.condition()) : ResourceCondition.EXCELLENT)
                .maintenanceDate(request.maintenanceDate())
                .qrCode(qrCode)
                .availability(ResourceAvailability.AVAILABLE)
            .status(resolveStatus(request.status(), ResourceStatus.ACTIVE))
                .createdAt(Instant.now())
                .build();

        Resource saved = resourceRepository.save(resource);
        return toResponse(saved, resourceType.getName(), technicianName);
    }

    @Override
    public ResourceResponse getResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        ResourceType resourceType = resourceTypeRepository.findById(resource.getResourceTypeId())
                .orElseThrow(() -> new ResourceTypeNotFoundException(
                        "ResourceType not found with id: " + resource.getResourceTypeId()));

        String technicianName = null;
        if (resource.getAssignedTechnicianId() != null) {
            technicianName = userRepository.findById(resource.getAssignedTechnicianId())
                    .map(User::getName)
                    .orElse(null);
        }

        return toResponse(resource, resourceType.getName(), technicianName);
    }

    @Override
    public Page<ResourceResponse> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable)
                .map(this::enrichResourceResponse);
    }

    @Override
    public ResourceResponse updateResource(String id, UpdateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        if (request.name() != null) {
            resource.setName(request.name());
        }
        if (request.resourceTypeId() != null) {
            // Validate new resource type exists
            ResourceType resourceType = resolveResourceType(request.resourceTypeId(), request.type());
            resource.setResourceTypeId(resourceType.getId());
            resource.setType(resourceType.getName());
        }
        if (request.description() != null) {
            resource.setDescription(request.description());
        }
        if (request.location() != null) {
            resource.setLocation(request.location());
        }
        if (request.capacity() != null) {
            resource.setCapacity(request.capacity());
        }
        if (request.availabilityStart() != null) {
            resource.setAvailabilityStart(request.availabilityStart());
        }
        if (request.availabilityEnd() != null) {
            resource.setAvailabilityEnd(request.availabilityEnd());
        }
        if (request.cost() != null) {
            resource.setCost(request.cost());
        }
        if (request.warrantyExpiry() != null) {
            resource.setWarrantyExpiry(request.warrantyExpiry());
        }
        if (request.assignedTechnicianId() != null) {
            userRepository.findById(request.assignedTechnicianId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Technician not found with id: " + request.assignedTechnicianId()));
            resource.setAssignedTechnicianId(request.assignedTechnicianId());
        }
        if (request.serialNumber() != null) {
            resource.setSerialNumber(request.serialNumber());
        }
        if (request.condition() != null) {
            resource.setCondition(ResourceCondition.valueOf(request.condition()));
        }
        if (request.maintenanceDate() != null) {
            resource.setMaintenanceDate(request.maintenanceDate());
        }
        if (request.availability() != null) {
            resource.setAvailability(ResourceAvailability.valueOf(request.availability()));
            resource.setStatus(mapAvailabilityToStatus(resource.getAvailability()));
        }
        if (request.status() != null) {
            resource.setStatus(resolveStatus(request.status(), resource.getStatus()));
            resource.setAvailability(mapStatusToAvailability(resource.getStatus()));
        }

        resource.setUpdatedAt(Instant.now());
        Resource updated = resourceRepository.save(resource);
        return enrichResourceResponse(updated);
    }

    @Override
    public ResourceResponse updateResourceStatus(String id, String status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        ResourceStatus newStatus = resolveStatus(status, resource.getStatus());
        resource.setStatus(newStatus);
        resource.setAvailability(mapStatusToAvailability(newStatus));
        resource.setUpdatedAt(Instant.now());

        Resource saved = resourceRepository.save(resource);
        return enrichResourceResponse(saved);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resourceRepository.deleteById(id);
    }

    @Override
    public List<ResourceResponse> searchResources(String type, String location, String availability, Integer capacity) {
        List<Resource> resources;
        String resolvedType = resolveTypeFilter(type);

        if (resolvedType != null && location != null && !location.isEmpty() && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByTypeLocationAvailability(resolvedType, location, availabilityEnum);
        } else if (resolvedType != null && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByTypeAndAvailability(resolvedType, availabilityEnum);
        } else if (location != null && !location.isEmpty() && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByLocationAndAvailability(location, availabilityEnum);
        } else if (resolvedType != null) {
            resources = resourceRepository.findByResourceTypeId(resolvedType);
        } else if (location != null && !location.isEmpty()) {
            resources = resourceRepository.findByLocation(location);
        } else if (availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByAvailability(availabilityEnum);
        } else {
            resources = resourceRepository.findAll();
        }

        return resources.stream()
                .map(this::enrichResourceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponse> getResourcesByType(String typeId) {
        return resourceRepository.findByResourceTypeId(typeId)
                .stream()
                .map(this::enrichResourceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponse> getResourcesByLocation(String location) {
        return resourceRepository.findByLocation(location)
                .stream()
                .map(this::enrichResourceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponse> getAssignedResources(String technicianId) {
        return resourceRepository.findByAssignedTechnicianId(technicianId)
                .stream()
                .map(this::enrichResourceResponse)
                .collect(Collectors.toList());
    }

    private ResourceResponse enrichResourceResponse(Resource resource) {
        ResourceType resourceType = resourceTypeRepository.findById(resource.getResourceTypeId())
                .orElse(null);

        String resourceTypeName = resourceType != null ? resourceType.getName() : "Unknown";
        String technicianName = null;

        if (resource.getAssignedTechnicianId() != null) {
            technicianName = userRepository.findById(resource.getAssignedTechnicianId())
                    .map(User::getName)
                    .orElse(null);
        }

        return toResponse(resource, resourceTypeName, technicianName);
    }

    private ResourceResponse toResponse(Resource resource, String resourceTypeName, String technicianName) {
        return new ResourceResponse(
                resource.getId(),
                resource.getName(),
                resource.getType() != null ? resource.getType() : resourceTypeName,
                resource.getDescription(),
                resource.getResourceTypeId(),
                resourceTypeName,
                resource.getLocation(),
                resource.getCapacity(),
                resource.getAvailabilityStart(),
                resource.getAvailabilityEnd(),
                resource.getAvailability().name(),
                resource.getStatus() != null ? resource.getStatus().name() : ResourceStatus.ACTIVE.name(),
                resource.getCost(),
                resource.getWarrantyExpiry(),
                resource.getAssignedTechnicianId(),
                technicianName,
                resource.getSerialNumber(),
                resource.getCondition().name(),
                resource.getMaintenanceDate(),
                resource.getQrCode(),
                resource.getCreatedAt(),
                resource.getUpdatedAt()
        );
    }

    private ResourceType resolveResourceType(String resourceTypeId, String type) {
        if (resourceTypeId != null && !resourceTypeId.isBlank()) {
            return resourceTypeRepository.findById(resourceTypeId)
                    .orElseThrow(() -> new ResourceTypeNotFoundException(
                            "ResourceType not found with id: " + resourceTypeId));
        }

        if (type != null && !type.isBlank()) {
            return resourceTypeRepository.findByName(type)
                    .orElseThrow(() -> new ResourceTypeNotFoundException(
                            "ResourceType not found with name: " + type));
        }

        throw new ResourceTypeNotFoundException("Resource type is required");
    }

    private String resolveTypeFilter(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }

        return resourceTypeRepository.findByName(type)
                .map(ResourceType::getId)
                .orElse(type);
    }

    private ResourceStatus resolveStatus(String status, ResourceStatus fallback) {
        if (status == null || status.isBlank()) {
            return fallback;
        }
        return ResourceStatus.valueOf(status.trim().toUpperCase());
    }

    private ResourceAvailability mapStatusToAvailability(ResourceStatus status) {
        return status == ResourceStatus.OUT_OF_SERVICE
                ? ResourceAvailability.UNAVAILABLE
                : ResourceAvailability.AVAILABLE;
    }

    private ResourceStatus mapAvailabilityToStatus(ResourceAvailability availability) {
        return availability == ResourceAvailability.AVAILABLE
                ? ResourceStatus.ACTIVE
                : ResourceStatus.OUT_OF_SERVICE;
    }
}
