package com.wegroup423.smart_campus.features.booking.service.impl;

import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceCapacityProviderImpl implements ResourceCapacityProvider {

    private final ResourceRepository resourceRepository;

    @Override
    public int getCapacityForResource(String resourceId) {
        return resourceRepository.findById(resourceId)
                .map(r -> r.getCapacity() != null ? r.getCapacity() : 0)
                .orElse(0);
    }
}
