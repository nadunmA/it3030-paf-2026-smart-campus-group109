package com.wegroup423.smart_campus.features.admin.model.entity;

import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceCondition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
@CompoundIndex(name = "location_type_availability", def = "{'location': 1, 'resourceTypeId': 1, 'availability': 1}")
public class Resource {

    @Id
    private String id;

    private String name;

    private String resourceTypeId;

    @Indexed
    private String location;

    private Integer capacity;

    @Builder.Default
    private ResourceAvailability availability = ResourceAvailability.AVAILABLE;

    private Double cost;

    private LocalDate warrantyExpiry;

    private String assignedTechnicianId;

    private String serialNumber;

    @Builder.Default
    private ResourceCondition condition = ResourceCondition.EXCELLENT;

    private LocalDate maintenanceDate;

    private String qrCode;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
