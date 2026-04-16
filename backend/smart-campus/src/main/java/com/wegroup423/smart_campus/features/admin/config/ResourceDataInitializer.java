package com.wegroup423.smart_campus.features.admin.config;

import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.entity.ResourceType;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceCondition;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceStatus;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.admin.repository.ResourceTypeRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class ResourceDataInitializer {

    private final ResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;

    @Bean
    public CommandLineRunner initializeResourceData() {
        return args -> {
            if (resourceRepository.count() > 0) {
                return;
            }

            String lectureHallTypeId = ensureType("LECTURE_HALL", "Lecture halls for classroom instruction");
            String labTypeId = ensureType("LAB", "Laboratory spaces for practical work");
            String meetingRoomTypeId = ensureType("MEETING_ROOM", "Meeting rooms for discussions and conferences");
            String equipmentTypeId = ensureType("EQUIPMENT", "General equipment and shared assets");

            List<Resource> resources = List.of(
                    Resource.builder()
                            .name("Lecture Hall A1")
                            .type("LECTURE_HALL")
                            .description("Tiered lecture hall with projector and sound system")
                            .resourceTypeId(lectureHallTypeId)
                            .location("Main Building - Floor 1")
                            .capacity(180)
                            .availabilityStart(LocalDateTime.now().withHour(8).withMinute(0))
                            .availabilityEnd(LocalDateTime.now().withHour(18).withMinute(0))
                            .availability(ResourceAvailability.AVAILABLE)
                            .status(ResourceStatus.ACTIVE)
                            .cost(0.0)
                            .condition(ResourceCondition.EXCELLENT)
                            .maintenanceDate(LocalDate.now().plusMonths(2))
                            .qrCode("RESOURCE-SEED-LH-A1")
                            .createdAt(Instant.now())
                            .build(),
                    Resource.builder()
                            .name("Chemistry Lab L2")
                            .type("LAB")
                            .description("Chemistry lab with safety stations and fume hoods")
                            .resourceTypeId(labTypeId)
                            .location("Science Block - Floor 2")
                            .capacity(36)
                            .availabilityStart(LocalDateTime.now().withHour(9).withMinute(0))
                            .availabilityEnd(LocalDateTime.now().withHour(17).withMinute(0))
                            .availability(ResourceAvailability.AVAILABLE)
                            .status(ResourceStatus.ACTIVE)
                            .cost(0.0)
                            .condition(ResourceCondition.GOOD)
                            .maintenanceDate(LocalDate.now().plusMonths(1))
                            .qrCode("RESOURCE-SEED-LAB-L2")
                            .createdAt(Instant.now())
                            .build(),
                    Resource.builder()
                            .name("Meeting Room MR-05")
                            .type("MEETING_ROOM")
                            .description("Smart meeting room with video conferencing")
                            .resourceTypeId(meetingRoomTypeId)
                            .location("Admin Wing - Floor 3")
                            .capacity(14)
                            .availabilityStart(LocalDateTime.now().withHour(8).withMinute(30))
                            .availabilityEnd(LocalDateTime.now().withHour(19).withMinute(0))
                            .availability(ResourceAvailability.AVAILABLE)
                            .status(ResourceStatus.ACTIVE)
                            .cost(0.0)
                            .condition(ResourceCondition.EXCELLENT)
                            .maintenanceDate(LocalDate.now().plusMonths(3))
                            .qrCode("RESOURCE-SEED-MR-05")
                            .createdAt(Instant.now())
                            .build(),
                    Resource.builder()
                            .name("Dell Latitude 7420")
                            .type("EQUIPMENT")
                            .description("Loan laptop for staff and student presentations")
                            .resourceTypeId(equipmentTypeId)
                            .location("IT Help Desk")
                            .capacity(10)
                            .availability(ResourceAvailability.AVAILABLE)
                            .status(ResourceStatus.ACTIVE)
                            .cost(0.0)
                            .warrantyExpiry(LocalDate.now().plusYears(1))
                            .serialNumber("DL7420-SEED-01")
                            .usageInstructions("Borrow via IT desk, return same day, use original charger only")
                            .condition(ResourceCondition.GOOD)
                            .maintenanceDate(LocalDate.now().plusWeeks(6))
                            .qrCode("RESOURCE-SEED-EQ-LAPTOP-01")
                            .createdAt(Instant.now())
                            .build()
            );

            resourceRepository.saveAll(resources);
        };
    }

    private String ensureType(String name, String description) {
        return resourceTypeRepository.findByName(name)
                .map(ResourceType::getId)
                .orElseGet(() -> resourceTypeRepository.save(
                        ResourceType.builder()
                                .name(name)
                                .description(description)
                                .isDefault(true)
                                .createdAt(LocalDateTime.now())
                                .build()
                ).getId());
    }
}
