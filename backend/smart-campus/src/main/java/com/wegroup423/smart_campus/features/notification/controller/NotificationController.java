package com.wegroup423.smart_campus.features.notification.controller;



import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    private String currentUserId(Authentication auth) {
        return auth.getName(); // make sure JWT subject = userId
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

    @PatchMapping("/my/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(currentUserId(auth));
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(notificationService.markAsRead(id, currentUserId(auth)));
    }
}