package com.wegroup423.smart_campus.features.resources.controller;

import com.wegroup423.smart_campus.features.resources.model.dto.request.CreateResourceRequest;
import com.wegroup423.smart_campus.features.resources.model.dto.request.UpdateResourceRequest;
import com.wegroup423.smart_campus.features.resources.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.resources.service.ResourceService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceApiController {

    private final ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<List<ResourceResponse>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        return ResponseEntity.ok(resourceService.searchResources(type, location, null, capacity));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResource(id));
    }

    @GetMapping("/lookup")
    @PreAuthorize("hasAnyRole('ADMIN','USER','TECHNICIAN')")
    public ResponseEntity<ResourceResponse> getResourceByQrCode(@RequestParam String qrCode) {
        return ResponseEntity.ok(resourceService.getResourceByQrCode(qrCode));
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportResourcesCsv(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        String csv = resourceService.exportResourcesAsCsv(type, location, capacity);
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String fileName = "resources-report-" + date + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable String id,
            @Valid @RequestBody UpdateResourceRequest request) {
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(resourceService.updateResourceStatus(id, request.status()));
    }

    private record StatusUpdateRequest(String status) {}
}
