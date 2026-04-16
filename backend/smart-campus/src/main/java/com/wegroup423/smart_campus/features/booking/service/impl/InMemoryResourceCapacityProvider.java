package com.wegroup423.smart_campus.features.booking.service.impl;

import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.booking.exception.ResourceCapacityNotFoundException;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import org.springframework.stereotype.Component;

@Component
public class InMemoryResourceCapacityProvider implements ResourceCapacityProvider {

    private final ResourceRepository resourceRepository;

    public InMemoryResourceCapacityProvider(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public int getCapacityForResource(String resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceCapacityNotFoundException(
                        "Capacity is not configured for resource: " + resourceId));

        Integer capacity = resource.getCapacity();
        if (capacity == null) {
            throw new ResourceCapacityNotFoundException("Capacity is not configured for resource: " + resourceId);
        }
        return capacity;
    }
}
