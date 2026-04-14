package com.wegroup423.smart_campus.features.admin.controller;

import com.wegroup423.smart_campus.features.auth.model.User;
import com.wegroup423.smart_campus.features.auth.repository.UserRepository;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.service.BookingService;
import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.repository.NotificationRepository;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(
            BookingService bookingService,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/bookings")
    public List<Map<String, Object>> getBookings() {
        return bookingService.getAllBookings(null, null).stream()
                .map(this::toBookingView)
                .toList();
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        Map<String, Long> bookingCountByUser = bookingService.getAllBookings(null, null).stream()
                .collect(java.util.stream.Collectors.groupingBy(BookingResponse::userId, java.util.stream.Collectors.counting()));

        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(u -> toUserView(u, bookingCountByUser.getOrDefault(u.getId(), 0L)))
                .toList();
    }

    @PatchMapping("/users/{userId}/role")
    public Map<String, Object> updateUserRole(@PathVariable String userId, @RequestBody RoleUpdateRequest request) {
        if (request == null || request.role() == null || request.role().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }

        User user = findUserOrThrow(userId);
        try {
            user.setRole(User.Role.valueOf(request.role().trim().toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + request.role());
        }

        userRepository.save(user);
        return toUserView(user, 0);
    }

    @PatchMapping("/users/{userId}/active")
    public Map<String, Object> updateUserActive(@PathVariable String userId, @RequestBody ActiveUpdateRequest request) {
        if (request == null || request.active() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active flag is required");
        }

        User user = findUserOrThrow(userId);
        user.setActive(request.active());
        userRepository.save(user);
        return toUserView(user, 0);
    }

    @GetMapping("/resources")
    public List<Map<String, Object>> getResources() {
        return List.of();
    }

    @GetMapping("/tickets")
    public List<Map<String, Object>> getTickets() {
        return List.of();
    }

    @GetMapping("/activity")
    public List<Map<String, Object>> getActivity() {
        return notificationRepository.findAll().stream()
                .sorted(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(25)
                .map(this::toActivityView)
                .toList();
    }

    private Map<String, Object> toBookingView(BookingResponse booking) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", booking.id());
        view.put("user", booking.userId());
        view.put("resource", booking.resourceId());
        view.put("date", booking.bookingDate() != null ? booking.bookingDate().toString() : "");
        view.put("purpose", nullSafe(booking.purpose()));
        view.put("status", booking.status() != null ? booking.status().name() : "PENDING");
        return view;
    }

    private Map<String, Object> toActivityView(Notification n) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("text", n.getTitle() + " - " + n.getMessage());
        view.put("time", relativeTime(n.getCreatedAt()));
        view.put("color", colorForType(n.getType()));
        return view;
    }

    private Map<String, Object> toUserView(User user, long bookingCount) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", nullSafe(user.getId()));
        view.put("name", nullSafe(user.getName()));
        view.put("email", nullSafe(user.getEmail()));
        view.put("role", user.getRole() != null ? user.getRole().name() : "USER");
        view.put("bookings", bookingCount);
        view.put("tickets", 0);
        view.put("joined", formatDate(user.getCreatedAt()));
        view.put("active", user.isActive());
        return view;
    }

    private User findUserOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }

    private String formatDate(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "";
        }
        return DATE_FORMAT.format(createdAt);
    }

    private String relativeTime(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "just now";
        }
        Instant then = createdAt.toInstant(ZoneOffset.UTC);
        long minutes = Math.max(0, Duration.between(then, Instant.now()).toMinutes());
        if (minutes < 1) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes + "m ago";
        }
        long hours = minutes / 60;
        if (hours < 24) {
            return hours + "h ago";
        }
        long days = hours / 24;
        return days + "d ago";
    }

    private String colorForType(Notification.NotificationType type) {
        if (type == null) {
            return "#3B82F6";
        }
        return switch (type) {
            case BOOKING_APPROVED -> "#10B981";
            case BOOKING_REJECTED -> "#EF4444";
            case BOOKING_CANCELLED -> "#F59E0B";
            case TICKET_STATUS_CHANGED, TICKET_ASSIGNED -> "#3B82F6";
            case NEW_COMMENT -> "#8B5CF6";
            case GENERAL -> "#64748B";
        };
    }

    private record RoleUpdateRequest(String role) {
    }

    private record ActiveUpdateRequest(Boolean active) {
    }
}
