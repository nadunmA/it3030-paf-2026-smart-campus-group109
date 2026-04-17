package com.wegroup423.smart_campus.features.ticket.repository;

import com.wegroup423.smart_campus.features.ticket.model.entity.Ticket;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    List<Ticket> findByAssignedTechnicianIdOrderByCreatedAtDesc(String technicianId);

    List<Ticket> findByStatus(TicketStatus status);

    long countByStatus(TicketStatus status);

    long countByCreatedBy(String userId);
}
