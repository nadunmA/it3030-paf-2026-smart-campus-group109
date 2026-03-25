package com.wegroup423.smart_campus.service;



import com.wegroup423.smart_campus.entity.Notification;
import com.wegroup423.smart_campus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        // Ensure user owns this notification
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
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
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
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
}