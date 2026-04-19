package com.wegroup423.smart_campus.features.resources.controller;

import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceResponse;
import com.wegroup423.smart_campus.features.admin.model.dto.response.ResourceTypeResponse;
import com.wegroup423.smart_campus.features.admin.service.ResourceService;
import com.wegroup423.smart_campus.features.admin.service.ResourceTypeService;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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
    private final ResourceTypeService resourceTypeService;

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity) {
        return ResponseEntity.ok(resourceService.searchResources(type, location, null, capacity));
    }

    @GetMapping("/types")
    public ResponseEntity<List<ResourceTypeResponse>> getResourceTypes() {
        return ResponseEntity.ok(resourceTypeService.getAllResourceTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResource(id));
    }

    @GetMapping("/lookup")
    public ResponseEntity<ResourceResponse> getResourceByQrCode(@RequestParam String qrCode) {
        return ResponseEntity.ok(resourceService.getResourceByQrCode(qrCode));
    }

        @GetMapping(value = "/view", produces = MediaType.TEXT_HTML_VALUE)
        public ResponseEntity<String> viewResourceByQrCode(@RequestParam String qrCode) {
                ResourceResponse resource = resourceService.getResourceByQrCode(qrCode);
                return ResponseEntity.ok(renderResourceHtml(resource));
        }

        @GetMapping(value = "/view/{id}", produces = MediaType.TEXT_HTML_VALUE)
        public ResponseEntity<String> viewResourceById(@PathVariable String id) {
                ResourceResponse resource = resourceService.getResource(id);
                return ResponseEntity.ok(renderResourceHtml(resource));
        }

        private String renderResourceHtml(ResourceResponse resource) {
                String title = escape(resource.name());
                String type = escape(resource.type() != null ? resource.type() : resource.resourceTypeName());
                String description = escape(resource.description());
                String location = escape(resource.location());
                String status = escape(resource.status());
                String availability = escape(resource.availability());
                String qrCode = escape(resource.qrCode());
                String resourceId = escape(resource.id());

                String createdAt = resource.createdAt() == null
                        ? "-"
                        : DateTimeFormatter.ISO_INSTANT.format(resource.createdAt());

                return """
                        <!doctype html>
                        <html>
                        <head>
                            <meta charset=\"utf-8\" />
                            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
                            <title>SmartCampus Resource</title>
                            <style>
                                body { font-family: Segoe UI, Arial, sans-serif; background: #f5f7fa; margin: 0; color: #1a1d23; }
                                .header { background: #2563eb; color: #fff; text-align: center; padding: 20px; }
                                .card { max-width: 760px; margin: 16px auto; background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
                                .name { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
                                .type { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 14px; }
                                table { width: 100%%; border-collapse: collapse; }
                                td { border-bottom: 1px solid #e8ebf0; padding: 10px 6px; font-size: 14px; vertical-align: top; }
                                td:first-child { width: 34%%; color: #6b7280; font-weight: 600; }
                            </style>
                        </head>
                        <body>
                            <div class=\"header\">SmartCampus Resource Details</div>
                            <div class=\"card\">
                                <h1 class=\"name\">%s</h1>
                                <div class=\"type\">%s</div>
                                <table>
                                    <tr><td>Description</td><td>%s</td></tr>
                                    <tr><td>Location</td><td>%s</td></tr>
                                    <tr><td>Status</td><td>%s</td></tr>
                                    <tr><td>Availability</td><td>%s</td></tr>
                                    <tr><td>QR Code</td><td>%s</td></tr>
                                    <tr><td>Resource ID</td><td>%s</td></tr>
                                    <tr><td>Created At</td><td>%s</td></tr>
                                </table>
                            </div>
                        </body>
                        </html>
                        """.formatted(title, type, description, location, status, availability, qrCode, resourceId, createdAt);
        }

        private String escape(String value) {
                if (value == null) {
                        return "-";
                }
                return value
                        .replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                        .replace("\"", "&quot;")
                        .replace("'", "&#39;");
        }
}
