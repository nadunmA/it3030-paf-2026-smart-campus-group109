package com.wegroup423.smart_campus.features.admin.repository;

import com.wegroup423.smart_campus.features.admin.model.entity.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceTypeRepository extends MongoRepository<ResourceType, String> {
    Optional<ResourceType> findByName(String name);

    List<ResourceType> findByIsDefault(boolean isDefault);
}
