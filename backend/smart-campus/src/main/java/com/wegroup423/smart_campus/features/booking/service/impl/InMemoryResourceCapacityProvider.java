package com.wegroup423.smart_campus.features.booking.service.impl;

import com.wegroup423.smart_campus.features.booking.exception.ResourceCapacityNotFoundException;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class InMemoryResourceCapacityProvider implements ResourceCapacityProvider {

    private static final Map<String, Integer> RESOURCE_CAPACITY = Map.of(
            "LH-001", 200,
            "LH-002", 120,
            "LAB-001", 40,
            "MR-001", 20,
            "EQ-001", 1
    );

    @Override
    public int getCapacityForResource(String resourceId) {
        Integer capacity = RESOURCE_CAPACITY.get(resourceId);
        if (capacity == null) {
            throw new ResourceCapacityNotFoundException("Capacity is not configured for resource: " + resourceId);
        }
        return capacity;
    }
}
