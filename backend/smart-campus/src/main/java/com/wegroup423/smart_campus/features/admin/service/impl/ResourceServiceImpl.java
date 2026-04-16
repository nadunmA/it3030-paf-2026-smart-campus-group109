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
        ResourceType resourceType = resourceTypeRepository.findById(request.resourceTypeId())
                .orElseThrow(() -> new ResourceTypeNotFoundException(
                        "ResourceType not found with id: " + request.resourceTypeId()));

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
                .resourceTypeId(request.resourceTypeId())
                .location(request.location())
                .capacity(request.capacity())
                .cost(request.cost())
                .warrantyExpiry(request.warrantyExpiry())
                .assignedTechnicianId(request.assignedTechnicianId())
                .serialNumber(request.serialNumber())
                .condition(request.condition() != null ? 
                        ResourceCondition.valueOf(request.condition()) : ResourceCondition.EXCELLENT)
                .maintenanceDate(request.maintenanceDate())
                .qrCode(qrCode)
                .availability(ResourceAvailability.AVAILABLE)
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
            resourceTypeRepository.findById(request.resourceTypeId())
                    .orElseThrow(() -> new ResourceTypeNotFoundException(
                            "ResourceType not found with id: " + request.resourceTypeId()));
            resource.setResourceTypeId(request.resourceTypeId());
        }
        if (request.location() != null) {
            resource.setLocation(request.location());
        }
        if (request.capacity() != null) {
            resource.setCapacity(request.capacity());
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
        }

        resource.setUpdatedAt(Instant.now());
        Resource updated = resourceRepository.save(resource);
        return enrichResourceResponse(updated);
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

        if (type != null && !type.isEmpty() && location != null && !location.isEmpty() && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByTypeLocationAvailability(type, location, availabilityEnum);
        } else if (type != null && !type.isEmpty() && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByTypeAndAvailability(type, availabilityEnum);
        } else if (location != null && !location.isEmpty() && availability != null) {
            ResourceAvailability availabilityEnum = ResourceAvailability.valueOf(availability);
            resources = resourceRepository.findByLocationAndAvailability(location, availabilityEnum);
        } else if (type != null && !type.isEmpty()) {
            resources = resourceRepository.findByResourceTypeId(type);
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
                resource.getResourceTypeId(),
                resourceTypeName,
                resource.getLocation(),
                resource.getCapacity(),
                resource.getAvailability().name(),
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
}
