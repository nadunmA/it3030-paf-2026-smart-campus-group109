package com.wegroup423.smart_campus.features.ticket.service.impl;

import com.wegroup423.smart_campus.features.booking.exception.BookingNotFoundException;
import com.wegroup423.smart_campus.features.booking.exception.InvalidBookingStateException;
import com.wegroup423.smart_campus.features.booking.exception.UnauthorizedBookingActionException;
import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.AddCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.CreateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.EditCommentRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.request.UpdateTicketRequest;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.CommentResponse;
import com.wegroup423.smart_campus.features.ticket.model.dto.response.TicketResponse;
import com.wegroup423.smart_campus.features.ticket.model.entity.Ticket;
import com.wegroup423.smart_campus.features.ticket.model.entity.TicketComment;
import com.wegroup423.smart_campus.features.ticket.model.enums.Priority;
import com.wegroup423.smart_campus.features.ticket.model.enums.TicketStatus;
import com.wegroup423.smart_campus.features.ticket.repository.TicketRepository;
import com.wegroup423.smart_campus.features.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private static final int MAX_ATTACHMENTS = 3;
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/gif", "image/webp");

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    @Value("${app.uploads.dir:uploads}")
    private String uploadsDir;

    @Override
    public TicketResponse createTicket(CreateTicketRequest request, String currentUserId, String userName) {
        Instant now = Instant.now();
        Ticket ticket = Ticket.builder()
                .resourceId(request.resourceId())
                .location(request.location())
                .createdBy(currentUserId)
                .category(request.category())
                .description(request.description())
                .priority(request.priority())
                .status(TicketStatus.OPEN)
                .preferredContact(request.preferredContact())
                .createdAt(now)
                .updatedAt(now)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        log.info("Ticket created: {} by user: {}", saved.getId(), currentUserId);
        return toResponse(saved);
    }

    @Override
    public List<TicketResponse> getTickets(String currentUserId, String role, TicketStatus status, Priority priority) {
        List<Ticket> tickets;

        boolean isAdmin = "ADMIN".equals(role);
        boolean isTechnician = "TECHNICIAN".equals(role);

        if (isAdmin) {
            if (status != null) {
                tickets = ticketRepository.findByStatusOrderByCreatedAtDesc(status);
            } else if (priority != null) {
                tickets = ticketRepository.findByPriorityOrderByCreatedAtDesc(priority);
            } else {
                tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
            }
        } else if (isTechnician) {
            tickets = ticketRepository.findByAssignedTechnicianIdOrderByCreatedAtDesc(currentUserId);
        } else {
            if (status != null) {
                tickets = ticketRepository.findByCreatedByAndStatusOrderByCreatedAtDesc(currentUserId, status);
            } else {
                tickets = ticketRepository.findByCreatedByOrderByCreatedAtDesc(currentUserId);
            }
        }

        return tickets.stream().map(this::toResponse).toList();
    }

    @Override
    public TicketResponse getTicketById(String ticketId, String currentUserId, String role) {
        Ticket ticket = findOrThrow(ticketId);
        checkReadAccess(ticket, currentUserId, role);
        return toResponse(ticket);
    }

    @Override
    public TicketResponse updateTicket(String ticketId, UpdateTicketRequest request, String currentUserId, String role) {
        Ticket ticket = findOrThrow(ticketId);

        boolean isAdmin = "ADMIN".equals(role);
        boolean isTechnician = "TECHNICIAN".equals(role);
        boolean isAssigned = currentUserId.equals(ticket.getAssignedTechnicianId());

        if (!isAdmin && !(isTechnician && isAssigned)) {
            throw new UnauthorizedBookingActionException("Only ADMIN or the assigned technician can update a ticket.");
        }

        if (request.status() != null) {
            TicketStatus current = ticket.getStatus();
            if (!current.canTransitionTo(request.status())) {
                throw new InvalidBookingStateException(
                        "Invalid status transition from " + current + " to " + request.status());
            }
            TicketStatus oldStatus = ticket.getStatus();
            ticket.setStatus(request.status());

            // Notify ticket creator on status change
            if (!ticket.getCreatedBy().equals(currentUserId)) {
                notificationService.createNotification(
                        ticket.getCreatedBy(),
                        "Ticket Status Updated",
                        "Your ticket (" + ticket.getId() + ") status changed to " + request.status(),
                        Notification.NotificationType.TICKET_STATUS_CHANGED,
                        ticket.getId(),
                        "TICKET"
                );
            }
        }

        if (request.assignedTechnicianId() != null) {
            ticket.setAssignedTechnicianId(request.assignedTechnicianId());
            // Notify technician
            notificationService.createNotification(
                    request.assignedTechnicianId(),
                    "Ticket Assigned",
                    "You have been assigned to ticket " + ticket.getId() + " at " + ticket.getLocation(),
                    Notification.NotificationType.TICKET_ASSIGNED,
                    ticket.getId(),
                    "TICKET"
            );
            if (ticket.getStatus() == TicketStatus.OPEN) {
                ticket.setStatus(TicketStatus.IN_PROGRESS);
            }
        }

        if (request.resolutionNotes() != null) {
            ticket.setResolutionNotes(request.resolutionNotes());
        }

        if (request.rejectionReason() != null) {
            ticket.setRejectionReason(request.rejectionReason());
        }

        ticket.setUpdatedAt(Instant.now());
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    @Override
    public void deleteTicket(String ticketId, String currentUserId, String role) {
        Ticket ticket = findOrThrow(ticketId);

        boolean isAdmin = "ADMIN".equals(role);
        boolean isOwner = ticket.getCreatedBy().equals(currentUserId);

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedBookingActionException("Only ADMIN or the ticket creator can delete this ticket.");
        }

        // Only allow deletion of OPEN or REJECTED tickets
        if (ticket.getStatus() != TicketStatus.OPEN && ticket.getStatus() != TicketStatus.REJECTED
                && ticket.getStatus() != TicketStatus.CLOSED && !isAdmin) {
            throw new InvalidBookingStateException("Cannot delete a ticket that is in progress or resolved.");
        }

        ticketRepository.delete(ticket);
        log.info("Ticket {} deleted by user: {}", ticketId, currentUserId);
    }

    @Override
    public TicketResponse addComment(String ticketId, AddCommentRequest request, String currentUserId, String userName) {
        Ticket ticket = findOrThrow(ticketId);

        TicketComment comment = TicketComment.builder()
                .id(UUID.randomUUID().toString())
                .userId(currentUserId)
                .userName(userName)
                .content(request.content())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(Instant.now());
        Ticket saved = ticketRepository.save(ticket);

        // Notify ticket owner of new comment (if commenter is not the owner)
        if (!ticket.getCreatedBy().equals(currentUserId)) {
            notificationService.createNotification(
                    ticket.getCreatedBy(),
                    "New Comment on Your Ticket",
                    userName + " commented on your ticket: " + truncate(request.content(), 80),
                    Notification.NotificationType.NEW_COMMENT,
                    ticketId,
                    "TICKET"
            );
        }

        return toResponse(saved);
    }

    @Override
    public TicketResponse editComment(String ticketId, String commentId, EditCommentRequest request, String currentUserId) {
        Ticket ticket = findOrThrow(ticketId);

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new BookingNotFoundException("Comment not found: " + commentId));

        if (!comment.getUserId().equals(currentUserId)) {
            throw new UnauthorizedBookingActionException("You can only edit your own comments.");
        }

        comment.setContent(request.content());
        comment.setUpdatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    @Override
    public TicketResponse deleteComment(String ticketId, String commentId, String currentUserId, String role) {
        Ticket ticket = findOrThrow(ticketId);

        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new BookingNotFoundException("Comment not found: " + commentId));

        boolean isAdmin = "ADMIN".equals(role);
        boolean isOwner = comment.getUserId().equals(currentUserId);

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedBookingActionException("You can only delete your own comments.");
        }

        ticket.getComments().remove(comment);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    @Override
    public TicketResponse uploadAttachments(String ticketId, List<MultipartFile> files, String currentUserId) {
        Ticket ticket = findOrThrow(ticketId);

        if (!ticket.getCreatedBy().equals(currentUserId)) {
            throw new UnauthorizedBookingActionException("Only the ticket creator can upload attachments.");
        }

        int existing = ticket.getAttachmentUrls().size();
        if (existing + files.size() > MAX_ATTACHMENTS) {
            throw new IllegalArgumentException(
                    "Maximum " + MAX_ATTACHMENTS + " attachments allowed. Current: " + existing);
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
                throw new IllegalArgumentException("Only image files (JPEG, PNG, GIF, WebP) are allowed.");
            }

            String filename = UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
            Path uploadPath = Paths.get(uploadsDir, "tickets", ticketId);

            try {
                Files.createDirectories(uploadPath);
                Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
                ticket.getAttachmentUrls().add("/api/tickets/" + ticketId + "/attachments/" + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
            }
        }

        ticket.setUpdatedAt(Instant.now());
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private Ticket findOrThrow(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new BookingNotFoundException("Ticket not found: " + ticketId));
    }

    private void checkReadAccess(Ticket ticket, String currentUserId, String role) {
        boolean isAdmin = "ADMIN".equals(role);
        boolean isTechnician = "TECHNICIAN".equals(role);
        boolean isOwner = ticket.getCreatedBy().equals(currentUserId);
        boolean isAssigned = currentUserId.equals(ticket.getAssignedTechnicianId());

        if (!isAdmin && !isOwner && !(isTechnician && isAssigned)) {
            throw new UnauthorizedBookingActionException("Access denied to this ticket.");
        }
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max) + "...";
    }

    private TicketResponse toResponse(Ticket ticket) {
        List<CommentResponse> comments = ticket.getComments().stream()
                .map(c -> new CommentResponse(
                        c.getId(),
                        c.getUserId(),
                        c.getUserName(),
                        c.getContent(),
                        c.getCreatedAt(),
                        c.getUpdatedAt()))
                .toList();

        return new TicketResponse(
                ticket.getId(),
                ticket.getResourceId(),
                ticket.getLocation(),
                ticket.getCreatedBy(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getAssignedTechnicianId(),
                ticket.getResolutionNotes(),
                ticket.getRejectionReason(),
                ticket.getPreferredContact(),
                ticket.getAttachmentUrls(),
                comments,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}
