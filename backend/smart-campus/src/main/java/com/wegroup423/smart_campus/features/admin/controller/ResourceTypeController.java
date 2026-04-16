package com.wegroup423.smart_campus.features.admin.controller;

import com.wegroup423.smart_campus.features.admin.model.dto.request.CreateResourceTypeRequest;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceTypeResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/resources/types")
@RequiredArgsConstructor
public class ResourceTypeController {

    private final ResourceTypeService resourceTypeService;

    @GetMapping
    public ResponseEntity<List<ResourceTypeResponse>> getAllResourceTypes() {
        List<ResourceTypeResponse> types = resourceTypeService.getAllResourceTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/defaults")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResourceTypeResponse>> getDefaultResourceTypes() {
        List<ResourceTypeResponse> types = resourceTypeService.getDefaultResourceTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceTypeResponse> getResourceType(@PathVariable String id) {
        ResourceTypeResponse type = resourceTypeService.getResourceType(id);
        return ResponseEntity.ok(type);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceTypeResponse> createResourceType(@Valid @RequestBody CreateResourceTypeRequest request) {
        ResourceTypeResponse type = resourceTypeService.createResourceType(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(type);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResourceType(@PathVariable String id) {
        resourceTypeService.deleteResourceType(id);
        return ResponseEntity.noContent().build();
    }
}
