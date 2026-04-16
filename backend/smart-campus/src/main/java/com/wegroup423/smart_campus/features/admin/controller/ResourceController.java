package com.wegroup423.smart_campus.features.admin.controller;

import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/facilities")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * Create a new resource (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody CreateResourceRequest request) {
        ResourceResponse resource = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    /**
         * Get all resources with pagination (Authenticated users)
     */
    @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<Page<ResourceResponse>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ResourceResponse> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get a single resource by ID (Authenticated users)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable String id, Authentication authentication) {
        ResourceResponse resource = resourceService.getResource(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * Update a resource (Admin only)
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable String id,
            @Valid @RequestBody UpdateResourceRequest request) {
        ResourceResponse resource = resourceService.updateResource(id, request);
        return ResponseEntity.ok(resource);
    }

    /**
     * Delete a resource (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    /**
         * Search/filter resources (Authenticated users)
     * Query params: type, location, availability, capacity
     */
    @GetMapping("/search")
        @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<List<ResourceResponse>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) Integer capacity) {
        List<ResourceResponse> resources = resourceService.searchResources(type, location, availability, capacity);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get resources by type (Authenticated users)
     */
    @GetMapping("/by-type/{typeId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<List<ResourceResponse>> getResourcesByType(@PathVariable String typeId) {
        List<ResourceResponse> resources = resourceService.getResourcesByType(typeId);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get resources by location (Authenticated users)
     */
    @GetMapping("/by-location/{location}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<List<ResourceResponse>> getResourcesByLocation(@PathVariable String location) {
        List<ResourceResponse> resources = resourceService.getResourcesByLocation(location);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get assigned resources for technician
     */
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<ResourceResponse>> getAssignedResources(Authentication authentication) {
        String technicianId = authentication.getName();
        List<ResourceResponse> resources = resourceService.getAssignedResources(technicianId);
        return ResponseEntity.ok(resources);
    }

    /**
     * Update status of assigned resource (Technician only - can only update availability and condition)
     */
    @PatchMapping("/assigned/{id}")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<ResourceResponse> updateAssignedResourceStatus(
            @PathVariable String id,
            @RequestBody UpdateResourceRequest request,
            Authentication authentication) {
        String technicianId = authentication.getName();
        ResourceResponse resource = resourceService.getResource(id);

        // Verify technician is assigned to this resource
        if (!technicianId.equals(resource.assignedTechnicianId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Only allow updating availability and condition for technicians
        UpdateResourceRequest limitedRequest = new UpdateResourceRequest(
                null, null, null, null, null, null, null, null,
                request.condition(),
                null,
                request.availability()
        );

        ResourceResponse updated = resourceService.updateResource(id, limitedRequest);
        return ResponseEntity.ok(updated);
    }
}
