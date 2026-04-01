package com.wegroup423.smart_campus.features.notification.controller;



import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications
    // Get all notifications for logged-in user
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {

        List<Notification> notifications = unreadOnly
                ? notificationService.getUnreadNotifications(userId)
                : notificationService.getNotificationsForUser(userId);

        long unreadCount = notificationService.getUnreadCount(userId);

        return ResponseEntity.ok(Map.of(
                "notifications", notifications,
                "unreadCount", unreadCount,
                "total", notifications.size()
        ));
    }

    // PUT /api/notifications/{id}/read
    // Mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal String userId) {

        Notification updated = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(updated);
    }

    // PUT /api/notifications/read-all
    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @AuthenticationPrincipal String userId) {

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // DELETE /api/notifications/{id}
    // Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable String id,
            @AuthenticationPrincipal String userId) {

        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }
}