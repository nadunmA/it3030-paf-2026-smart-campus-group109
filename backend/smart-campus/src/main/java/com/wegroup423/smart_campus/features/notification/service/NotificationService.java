package com.wegroup423.smart_campus.features.notification.service;
import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.repository.NotificationRepository;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Get all notifications for a user
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get only unread notifications
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    // Get unread count
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    // Mark single notification as read
    public Notification markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Mark all notifications as read for user
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("Marked {} notifications as read for user: {}", unread.size(), userId);
    }

    // Delete a notification
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        notificationRepository.delete(notification);
    }

    // Create notification — called by other services (booking, ticket, etc.)
    public Notification createNotification(String userId, String title, String message,
                                           Notification.NotificationType type,
                                           String relatedEntityId, String relatedEntityType) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created for user: {} | type: {}", userId, type);
        return saved;
    }

    //anjitha booking temp
    public Notification notifyBookingEvent(BookingNotificationEvent event) {
    String title;
    String message;
    Notification.NotificationType type;

    switch (event.action()) {
        case "BOOKING_CREATED" -> {
            title = "Booking Created";
            message = "Your booking for resource " + event.resourceId() + " was created successfully.";
            type = Notification.NotificationType.GENERAL;
        }
        case "BOOKING_APPROVED" -> {
            title = "Booking Approved";
            message = "Your booking for resource " + event.resourceId() + " was approved.";
            type = Notification.NotificationType.BOOKING_APPROVED;
        }
        case "BOOKING_REJECTED" -> {
            title = "Booking Rejected";
            message = "Your booking for resource " + event.resourceId() + " was rejected."
                    + (event.reason() != null ? " Reason: " + event.reason() : "");
            type = Notification.NotificationType.BOOKING_REJECTED;
        }
        case "BOOKING_CANCELLED" -> {
            title = "Booking Cancelled";
            message = "Your booking for resource " + event.resourceId() + " was cancelled.";
            type = Notification.NotificationType.BOOKING_CANCELLED;
        }
        default -> {
            title = "Booking Update";
            message = "Your booking was updated.";
            type = Notification.NotificationType.GENERAL;
        }
    }

    return createNotification(
            event.ownerUserId(),
            title,
            message,
            type,
            event.bookingId(),
            "BOOKING"
    );
}
}