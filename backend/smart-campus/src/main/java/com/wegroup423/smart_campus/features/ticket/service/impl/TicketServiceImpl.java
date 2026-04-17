package com.wegroup423.smart_campus.features.ticket.service.impl;

import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.*;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;
import com.wegroup423.smart_campus.features.ticket.model.entity.Ticket;
import com.wegroup423.smart_campus.features.ticket.model.entity.TicketComment;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import com.wegroup423.smart_campus.features.ticket.repository.TicketRepository;
import com.wegroup423.smart_campus.features.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request, String userId, String userName) {
        Ticket ticket = Ticket.builder()
                .title(request.title())
                .description(request.description())
                .location(request.location())
                .resourceId(request.resourceId())
                .resourceName(request.resourceName())
                .category(request.category())
                .priority(request.priority() != null ? request.priority() :
                        com.wegroup423.smart_campus.features.ticket.model.enums.Priority.MEDIUM)
                .createdBy(userId)
                .reportedBy(userName)
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        Ticket saved = ticketRepository.save(ticket);
        log.info("Ticket created: {} by user: {}", saved.getId(), userId);
        return TicketResponse.from(saved);
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(TicketResponse::from).toList();
    }

    @Override
    public List<TicketResponse> getMyTickets(String userId) {
        return ticketRepository.findByCreatedByOrderByCreatedAtDesc(userId)
                .stream().map(TicketResponse::from).toList();
    }

    @Override
    public List<TicketResponse> getAssignedTickets(String technicianId) {
        return ticketRepository.findByAssignedTechnicianIdOrderByCreatedAtDesc(technicianId)
                .stream().map(TicketResponse::from).toList();
    }

    @Override
    public TicketResponse getTicketById(String id) {
        return ticketRepository.findById(id)
                .map(TicketResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found: " + id));
    }

    @Override
    public TicketResponse updateTicket(String id, UpdateTicketRequest request, String userId) {
        Ticket ticket = findTicketOrThrow(id);

        if (request.title() != null) ticket.setTitle(request.title());
        if (request.description() != null) ticket.setDescription(request.description());
        if (request.location() != null) ticket.setLocation(request.location());
        if (request.resourceId() != null) ticket.setResourceId(request.resourceId());
        if (request.resourceName() != null) ticket.setResourceName(request.resourceName());
        if (request.category() != null) ticket.setCategory(request.category());
        if (request.priority() != null) ticket.setPriority(request.priority());

        boolean technicianChanged = false;
        if (request.assignedTechnicianId() != null) {
            ticket.setAssignedTechnicianId(request.assignedTechnicianId());
            technicianChanged = true;
        }
        if (request.assignedTechnicianName() != null) {
            ticket.setAssignedTechnicianName(request.assignedTechnicianName());
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);

        if (technicianChanged && request.assignedTechnicianId() != null) {
            notificationService.notifyTicketEvent(
                    request.assignedTechnicianId(), saved.getId(), "TICKET_ASSIGNED", null);
            if (saved.getCreatedBy() != null && !saved.getCreatedBy().equals(request.assignedTechnicianId())) {
                notificationService.notifyTicketEvent(
                        saved.getCreatedBy(), saved.getId(), "TICKET_ASSIGNED", null);
            }
        }

        return TicketResponse.from(saved);
    }

    @Override
    public TicketResponse updateTicketStatus(String id, TicketStatusUpdateRequest request, String userId) {
        Ticket ticket = findTicketOrThrow(id);

        TicketStatus oldStatus = ticket.getStatus();
        ticket.setStatus(request.status());
        if (request.resolutionNote() != null) ticket.setResolutionNote(request.resolutionNote());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (request.status() == TicketStatus.RESOLVED || request.status() == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket saved = ticketRepository.save(ticket);

        if (saved.getCreatedBy() != null) {
            notificationService.notifyTicketEvent(
                    saved.getCreatedBy(), saved.getId(), "TICKET_STATUS_CHANGED",
                    oldStatus.name() + " → " + request.status().name());
        }

        log.info("Ticket {} status changed: {} → {}", id, oldStatus, request.status());
        return TicketResponse.from(saved);
    }

    @Override
    public void deleteTicket(String id, String userId) {
        Ticket ticket = findTicketOrThrow(id);
        ticketRepository.delete(ticket);
        log.info("Ticket {} deleted by user: {}", id, userId);
    }

    @Override
    public TicketResponse addComment(String ticketId, AddCommentRequest request, String userId, String userName) {
        Ticket ticket = findTicketOrThrow(ticketId);

        TicketComment comment = TicketComment.builder()
                .id(UUID.randomUUID().toString())
                .authorId(userId)
                .authorName(userName)
                .content(request.content())
                .createdAt(LocalDateTime.now())
                .build();

        if (ticket.getComments() == null) ticket.setComments(new ArrayList<>());
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        if (saved.getCreatedBy() != null && !saved.getCreatedBy().equals(userId)) {
            notificationService.notifyTicketEvent(
                    saved.getCreatedBy(), ticketId, "NEW_COMMENT", null);
        }

        return TicketResponse.from(saved);
    }

    @Override
    public TicketResponse editComment(String ticketId, String commentId, EditCommentRequest request, String userId) {
        Ticket ticket = findTicketOrThrow(ticketId);

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> commentId.equals(c.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found: " + commentId));

        if (!comment.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot edit another user's comment");
        }

        comment.setContent(request.content());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return TicketResponse.from(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse deleteComment(String ticketId, String commentId, String userId) {
        Ticket ticket = findTicketOrThrow(ticketId);

        boolean removed = ticket.getComments().removeIf(c ->
                commentId.equals(c.getId()) && (c.getAuthorId().equals(userId) || true)
        );

        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found: " + commentId);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse assignTicket(String id, AssignTicketRequest request, String adminId) {
        Ticket ticket = findTicketOrThrow(id);
        ticket.setAssignedTechnicianId(request.technicianId());
        ticket.setAssignedTechnicianName(request.technicianName());
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        // notify the assigned technician
        notificationService.notifyTicketEvent(
                request.technicianId(), saved.getId(), "TICKET_ASSIGNED",
                "You have been assigned to: " + saved.getTitle());
        // notify the reporter
        if (saved.getCreatedBy() != null) {
            notificationService.notifyTicketEvent(
                    saved.getCreatedBy(), saved.getId(), "TICKET_ASSIGNED",
                    "A technician has been assigned to your ticket: " + saved.getTitle());
        }
        log.info("Ticket {} assigned to technician {} by admin {}", id, request.technicianId(), adminId);
        return TicketResponse.from(saved);
    }

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found: " + id));
    }
}
