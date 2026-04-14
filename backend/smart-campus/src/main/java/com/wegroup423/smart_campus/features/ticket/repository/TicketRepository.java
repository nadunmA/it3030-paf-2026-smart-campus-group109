package com.wegroup423.smart_campus.features.ticket.repository;

import com.wegroup423.smart_campus.features.ticket.model.entity.Ticket;
import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    List<Ticket> findByAssignedTechnicianIdOrderByCreatedAtDesc(String technicianId);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findByPriorityOrderByCreatedAtDesc(Priority priority);

    List<Ticket> findByCreatedByAndStatusOrderByCreatedAtDesc(String createdBy, TicketStatus status);

    long countByStatus(TicketStatus status);

    long countByCreatedBy(String createdBy);

    long countByCreatedByAndStatus(String createdBy, TicketStatus status);
}
