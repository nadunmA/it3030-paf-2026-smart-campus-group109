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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Locale;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
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
        validateMeetingRoomFields(
            resourceType.getName(),
            request.description(),
            request.availabilityStart(),
            request.availabilityEnd(),
            request.capacity());

        String normalizedTechnicianId = normalizeTechnicianId(request.assignedTechnicianId());
        String technicianName = resolveTechnicianName(normalizedTechnicianId);

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
                .assignedTechnicianId(normalizedTechnicianId)
                .serialNumber(request.serialNumber())
                .usageInstructions(request.usageInstructions())
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
    public ResourceResponse getResourceByQrCode(String qrCode) {
        if (qrCode == null || qrCode.isBlank()) {
            throw new ResourceNotFoundException("QR code is required");
        }

        Resource resource = resourceRepository.findByQrCode(qrCode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found for qrCode: " + qrCode));

        return enrichResourceResponse(resource);
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
            resource.setAssignedTechnicianId(normalizeTechnicianId(request.assignedTechnicianId()));
        }
        if (request.serialNumber() != null) {
            resource.setSerialNumber(request.serialNumber());
        }
        if (request.usageInstructions() != null) {
            resource.setUsageInstructions(request.usageInstructions());
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

        validateMeetingRoomFields(
            resource.getType(),
            resource.getDescription(),
            resource.getAvailabilityStart(),
            resource.getAvailabilityEnd(),
            resource.getCapacity());

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
        String normalizedSection = normalizeTypeToken(type);
        String normalizedLocation = location == null ? "" : location.trim().toLowerCase(Locale.ROOT);
        ResourceAvailability availabilityEnum = parseAvailability(availability);
        Map<String, String> typeById = resourceTypeRepository.findAll().stream()
                .collect(Collectors.toMap(ResourceType::getId, rt -> normalizeTypeToken(rt.getName())));

        return resourceRepository.findAll().stream()
                .filter(resource -> matchesTypeSection(resource, normalizedSection, typeById))
                .filter(resource -> matchesLocation(resource, normalizedLocation))
                .filter(resource -> availabilityEnum == null || availabilityEnum == resource.getAvailability())
                .filter(resource -> capacity == null || capacity < 0 || (resource.getCapacity() != null && resource.getCapacity().equals(capacity)))
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

    @Override
    public String exportResourcesAsCsv(
            String type,
            String location,
            Integer capacity,
            LocalDate reportDate,
            LocalDate fromDate,
            LocalDate toDate) {
        List<ResourceResponse> resources = searchResources(type, location, null, capacity).stream()
                .filter(resource -> matchesReportDate(resource.createdAt(), reportDate, fromDate, toDate))
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder();
        csv.append("id,name,type,location,capacity,status,availability,assignedTechnician,warrantyExpiry,maintenanceDate,usageInstructions,qrCode\n");

        for (ResourceResponse resource : resources) {
            csv.append(csvCell(resource.id())).append(',')
                    .append(csvCell(resource.name())).append(',')
                    .append(csvCell(resource.type())).append(',')
                    .append(csvCell(resource.location())).append(',')
                    .append(csvCell(resource.capacity())).append(',')
                    .append(csvCell(resource.status())).append(',')
                    .append(csvCell(resource.availability())).append(',')
                    .append(csvCell(resource.assignedTechnicianName())).append(',')
                    .append(csvCell(resource.warrantyExpiry())).append(',')
                    .append(csvCell(resource.maintenanceDate())).append(',')
                    .append(csvCell(resource.usageInstructions())).append(',')
                    .append(csvCell(resource.qrCode()))
                    .append('\n');
        }

        return csv.toString();
    }

    private boolean matchesReportDate(Instant createdAt, LocalDate reportDate, LocalDate fromDate, LocalDate toDate) {
        if (createdAt == null) {
            return false;
        }

        LocalDate createdDate = createdAt.atZone(ZoneId.systemDefault()).toLocalDate();

        if (reportDate != null) {
            return createdDate.equals(reportDate);
        }

        if (fromDate != null && createdDate.isBefore(fromDate)) {
            return false;
        }

        if (toDate != null && createdDate.isAfter(toDate)) {
            return false;
        }

        return true;
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
                resource.getUsageInstructions(),
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

    private void validateMeetingRoomFields(
            String resourceTypeName,
            String description,
            LocalDateTime availabilityStart,
            LocalDateTime availabilityEnd,
            Integer capacity) {
        if (!"MEETING_ROOM".equals(normalizeTypeToken(resourceTypeName))) {
            return;
        }

        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Meeting room room facilities are required");
        }

        if (description.trim().length() < 10) {
            throw new IllegalArgumentException("Meeting room facilities must be at least 10 characters");
        }

        if (capacity == null || capacity < 2) {
            throw new IllegalArgumentException("Meeting room capacity must be at least 2");
        }

        if (availabilityStart == null || availabilityEnd == null) {
            throw new IllegalArgumentException("Meeting room availability start and end are required");
        }

        if (!availabilityStart.isBefore(availabilityEnd)) {
            throw new IllegalArgumentException("Meeting room availability start must be before availability end");
        }
    }

    private String normalizeTypeToken(String type) {
        if (type == null || type.isBlank()) {
            return null;
        }

        return type.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }

    private ResourceAvailability parseAvailability(String availability) {
        if (availability == null || availability.isBlank()) {
            return null;
        }

        try {
            return ResourceAvailability.valueOf(availability.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private boolean matchesLocation(Resource resource, String normalizedLocation) {
        if (normalizedLocation == null || normalizedLocation.isEmpty()) {
            return true;
        }

        String resourceLocation = resource.getLocation() == null
                ? ""
                : resource.getLocation().toLowerCase(Locale.ROOT);

        return resourceLocation.contains(normalizedLocation);
    }

    private boolean matchesTypeSection(Resource resource, String normalizedSection, Map<String, String> typeById) {
        if (normalizedSection == null || normalizedSection.isBlank()) {
            return true;
        }

        String normalizedType = Stream.of(
                        normalizeTypeToken(resource.getType()),
                        typeById.get(resource.getResourceTypeId()))
                .filter(value -> value != null && !value.isBlank())
                .findFirst()
                .orElse("");

        if (normalizedType.isBlank()) {
            return false;
        }

        Set<String> allowedTypes = mapSectionToTypes(normalizedSection);
        return allowedTypes.contains(normalizedType);
    }

    private Set<String> mapSectionToTypes(String normalizedSection) {
        return switch (normalizedSection) {
            case "ROOM" -> Set.of("ROOM", "MEETING_ROOM");
            case "LAB" -> Set.of("LAB", "LABORATORY");
            case "EQUIPMENT" -> Set.of("EQUIPMENT", "ASSET");
            case "HALL" -> Set.of("HALL", "LECTURE_HALL");
            default -> Set.of(normalizedSection);
        };
    }

    private String normalizeTechnicianId(String technicianId) {
        if (technicianId == null || technicianId.isBlank()) {
            return null;
        }

        String trimmed = technicianId.trim();
        return userRepository.findById(trimmed).isPresent() ? trimmed : null;
    }

    private String resolveTechnicianName(String technicianId) {
        if (technicianId == null) {
            return null;
        }

        return userRepository.findById(technicianId)
                .map(User::getName)
                .orElse(null);
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

    private String csvCell(Object value) {
        String raw = value == null ? "" : String.valueOf(value);
        String escaped = raw.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
