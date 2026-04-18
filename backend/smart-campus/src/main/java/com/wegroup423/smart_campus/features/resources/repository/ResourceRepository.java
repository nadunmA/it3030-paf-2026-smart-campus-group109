package com.wegroup423.smart_campus.features.resources.repository;

import com.wegroup423.smart_campus.features.resources.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceCondition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    Optional<Resource> findById(String id);

    Optional<Resource> findByQrCode(String qrCode);

    List<Resource> findByResourceTypeId(String resourceTypeId);

    List<Resource> findByLocation(String location);

    List<Resource> findByAssignedTechnicianId(String technicianId);

    List<Resource> findByAvailability(ResourceAvailability availability);

    Page<Resource> findAll(Pageable pageable);

    @Query("{ 'resourceTypeId': ?0, 'availability': ?1 }")
    List<Resource> findByTypeAndAvailability(String resourceTypeId, ResourceAvailability availability);

    List<Resource> findByCondition(ResourceCondition condition);
}
