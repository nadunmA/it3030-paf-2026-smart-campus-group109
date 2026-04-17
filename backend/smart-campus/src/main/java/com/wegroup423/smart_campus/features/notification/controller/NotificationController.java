package com.wegroup423.smart_campus.features.notification.controller;

import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private String resolveUserId(Object principal) {
        if (principal instanceof com.wegroup423.smart_campus.features.auth.model.User user) {
            return user.getId();
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            return ud.getUsername();
        }
        return principal.toString();
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyNotifications(
            @AuthenticationPrincipal Object principal,
            @RequestParam(value = "unreadOnly", defaultValue = "false") boolean unreadOnly) {
        String userId = resolveUserId(principal);

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
            @AuthenticationPrincipal Object principal,
            @RequestBody NotifRequest body) {
        String userId = resolveUserId(principal);
        Notification created = notificationService.createSelfNotification(userId, body.title(), body.message());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    @PatchMapping("/my/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@AuthenticationPrincipal Object principal) {
        String userId = resolveUserId(principal);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id) {
        String userId = resolveUserId(principal);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    @GetMapping("/stats/my")
    public ResponseEntity<Map<String, Object>> getMyStats(@AuthenticationPrincipal Object principal) {
        String userId = resolveUserId(principal);
        List<Notification> all = notificationService.getNotificationsForUser(userId);
        long unreadCount = notificationService.getUnreadCount(userId);
        long totalCount = all.size();
        long readCount = totalCount - unreadCount;

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "unreadCount", unreadCount,
                "totalCount", totalCount,
                "readCount", readCount
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @RequestBody UpdateNotifRequest body) {
        String userId = resolveUserId(principal);
        Notification updated = notificationService.updateNotification(
                id, userId, body.title(), body.message(), body.read());
        return ResponseEntity.ok(updated);
    }

    record NotifRequest(String title, String message) {}
    record UpdateNotifRequest(String title, String message, Boolean read) {}
}
