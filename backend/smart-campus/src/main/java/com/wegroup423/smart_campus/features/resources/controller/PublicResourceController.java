package com.wegroup423.smart_campus.features.resources.controller;

import com.wegroup423.smart_campus.features.resources.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.resources.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/resources")
@RequiredArgsConstructor
public class PublicResourceController {

    private final ResourceService resourceService;

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResource(id));
    }

    @GetMapping("/lookup")
    public ResponseEntity<ResourceResponse> getResourceByQrCode(@RequestParam String qrCode) {
        return ResponseEntity.ok(resourceService.getResourceByQrCode(qrCode));
    }
}
