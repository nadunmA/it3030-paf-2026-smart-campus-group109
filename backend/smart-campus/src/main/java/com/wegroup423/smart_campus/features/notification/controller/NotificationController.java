package com.wegroup423.smart_campus.features.notification.controller;



import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    private String currentUserId(Authentication auth) {
        return auth.getName();
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {

        String userId = currentUserId(auth);

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

        @PostMapping("/my")
        public ResponseEntity<Notification> createMyNotification(
            Authentication auth,
            @RequestBody CreateNotificationRequest request) {

        Notification created = notificationService.createSelfNotification(
            currentUserId(auth),
            request.title(),
            request.message()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }

        @PutMapping("/{id}")
        public ResponseEntity<Notification> updateNotification(
            @PathVariable String id,
            Authentication auth,
            @RequestBody UpdateNotificationRequest request) {

        Notification updated = notificationService.updateNotification(
            id,
            currentUserId(auth),
            request.title(),
            request.message(),
            request.read()
        );

        return ResponseEntity.ok(updated);
        }

    @PatchMapping("/my/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(currentUserId(auth));
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUserId(auth)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable String id, Authentication auth) {
        notificationService.deleteNotification(id, currentUserId(auth));
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    @GetMapping("/stats/my")
    public ResponseEntity<Map<String, Object>> getMyNotificationStats(Authentication auth) {
        String userId = currentUserId(auth);
        long unreadCount = notificationService.getUnreadCount(userId);
        long totalCount = notificationService.getNotificationsForUser(userId).size();

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "unreadCount", unreadCount,
                "totalCount", totalCount,
                "readCount", totalCount - unreadCount
        ));
    }

    private record CreateNotificationRequest(String title, String message) {
    }

    private record UpdateNotificationRequest(String title, String message, Boolean read) {
    }
}