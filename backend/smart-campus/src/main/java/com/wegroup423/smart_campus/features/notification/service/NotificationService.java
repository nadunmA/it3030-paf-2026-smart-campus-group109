package com.wegroup423.smart_campus.features.notification.service;

import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;
import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification markAsRead(String id, String userId) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found: " + id));

        if (!notif.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String id, String userId) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found: " + id));

        if (!notif.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notificationRepository.delete(notif);
    }

    public Notification createSelfNotification(String userId, String title, String message) {
        String resolvedTitle = (title == null || title.isBlank()) ? "General Update" : title;

        Notification notif = Notification.builder()
                .userId(userId)
                .title(resolvedTitle)
                .message(message)
                .type(Notification.NotificationType.GENERAL)
                .build();

        return notificationRepository.save(notif);
    }

    public Notification updateNotification(String id, String userId, String title, String message, Boolean read) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found: " + id));

        if (!notif.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (title != null) notif.setTitle(title);
        if (message != null) notif.setMessage(message);
        if (read != null) notif.setRead(read);

        return notificationRepository.save(notif);
    }

    public Notification notifyBookingEvent(BookingNotificationEvent event) {
        String action = event.action() != null ? event.action() : "";
        String title;
        String message;
        Notification.NotificationType type;

        switch (action) {
            case "BOOKING_APPROVED" -> {
                title = "Booking Approved";
                message = "Your booking for resource " + event.resourceId() + " has been approved.";
                type = Notification.NotificationType.BOOKING_APPROVED;
            }
            case "BOOKING_REJECTED" -> {
                title = "Booking Rejected";
                String reason = event.reason() != null ? event.reason() : "No reason provided";
                message = "Your booking was rejected. Reason: " + reason;
                type = Notification.NotificationType.BOOKING_REJECTED;
            }
            case "BOOKING_CANCELLED" -> {
                title = "Booking Cancelled";
                message = "Your booking for resource " + event.resourceId() + " has been cancelled.";
                type = Notification.NotificationType.BOOKING_CANCELLED;
            }
            default -> {
                title = "Booking Update";
                message = "There is an update on your booking " + event.bookingId() + ".";
                type = Notification.NotificationType.GENERAL;
            }
        }

        Notification notif = Notification.builder()
                .userId(event.ownerUserId())
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(event.bookingId())
                .relatedEntityType("BOOKING")
                .build();

        return notificationRepository.save(notif);
    }

    public Notification notifyTicketEvent(String userId, String ticketId, String action, String detail) {
        String title;
        String message;
        Notification.NotificationType type;

        switch (action) {
            case "TICKET_ASSIGNED" -> {
                title = "Ticket Assigned";
                message = "Ticket " + ticketId + " has been assigned to a technician.";
                type = Notification.NotificationType.TICKET_ASSIGNED;
            }
            case "TICKET_STATUS_CHANGED" -> {
                title = "Ticket Status Updated";
                message = "Your ticket status has been updated" + (detail != null ? ": " + detail : ".") ;
                type = Notification.NotificationType.TICKET_STATUS_CHANGED;
            }
            case "NEW_COMMENT" -> {
                title = "New Comment on Ticket";
                message = "Someone commented on your ticket.";
                type = Notification.NotificationType.NEW_COMMENT;
            }
            default -> {
                title = "Ticket Update";
                message = "There is an update on ticket " + ticketId + ".";
                type = Notification.NotificationType.GENERAL;
            }
        }

        Notification notif = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(ticketId)
                .relatedEntityType("TICKET")
                .build();

        return notificationRepository.save(notif);
    }
}
