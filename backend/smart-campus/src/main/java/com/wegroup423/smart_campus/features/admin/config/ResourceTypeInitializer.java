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
            // Check if default types already exist
            if (resourceTypeRepository.findByIsDefault(true).isEmpty()) {
                ResourceType lectureHall = ResourceType.builder()
                        .name("LECTURE_HALL")
                        .description("Lecture halls for classroom instruction")
                        .isDefault(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                ResourceType lab = ResourceType.builder()
                        .name("LAB")
                        .description("Laboratory spaces for practical work")
                        .isDefault(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                ResourceType meetingRoom = ResourceType.builder()
                        .name("MEETING_ROOM")
                        .description("Meeting rooms for discussions and conferences")
                        .isDefault(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                ResourceType projector = ResourceType.builder()
                        .name("PROJECTOR")
                        .description("Projectors for presentations")
                        .isDefault(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                ResourceType camera = ResourceType.builder()
                        .name("CAMERA")
                        .description("Cameras for recording and documentation")
                        .isDefault(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                resourceTypeRepository.save(lectureHall);
                resourceTypeRepository.save(lab);
                resourceTypeRepository.save(meetingRoom);
                resourceTypeRepository.save(projector);
                resourceTypeRepository.save(camera);

                System.out.println("Default resource types initialized successfully");
            }
        };
    }
}
