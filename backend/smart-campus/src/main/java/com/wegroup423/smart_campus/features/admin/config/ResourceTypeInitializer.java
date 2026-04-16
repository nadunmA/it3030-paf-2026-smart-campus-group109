package com.wegroup423.smart_campus.features.admin.config;

import com.wegroup423.smart_campus.features.admin.model.entity.ResourceType;
import com.wegroup423.smart_campus.features.admin.repository.ResourceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;

@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class ResourceTypeInitializer {

    private final ResourceTypeRepository resourceTypeRepository;

    @Bean
    public CommandLineRunner initializeResourceTypes() {
        return args -> {
            ensureType("LECTURE_HALL", "Lecture halls for classroom instruction");
            ensureType("LAB", "Laboratory spaces for practical work");
            ensureType("MEETING_ROOM", "Meeting rooms for discussions and conferences");
            ensureType("EQUIPMENT", "General equipment and shared assets");
        };
    }

    private void ensureType(String name, String description) {
        if (resourceTypeRepository.findByName(name).isPresent()) {
            return;
        }

        ResourceType resourceType = ResourceType.builder()
                .name(name)
                .description(description)
                .isDefault(true)
                .createdAt(LocalDateTime.now())
                .build();

        resourceTypeRepository.save(resourceType);
    }
}
