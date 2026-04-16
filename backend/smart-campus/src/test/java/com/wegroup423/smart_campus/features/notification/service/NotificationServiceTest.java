package com.wegroup423.smart_campus.features.notification.service;


import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;
import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification sampleNotif;

    @BeforeEach
    void setUp() {
        sampleNotif = new Notification();
        sampleNotif.setId("notif-001");
        sampleNotif.setUserId("user-123");
        sampleNotif.setTitle("Booking Approved");
        sampleNotif.setMessage("Your booking has been approved.");
        sampleNotif.setRead(false);
        sampleNotif.setType(Notification.NotificationType.BOOKING_APPROVED);
    }

    // ── getNotificationsForUser ────────────────────────────────────────────

    @Test
    void getNotificationsForUser_returnsListForUser() {
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc("user-123"))
                .thenReturn(List.of(sampleNotif));

        List<Notification> result = notificationService.getNotificationsForUser("user-123");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo("notif-001");
        verify(notificationRepository).findByUserIdOrderByCreatedAtDesc("user-123");
    }

    @Test
    void getNotificationsForUser_emptyList_returnsEmpty() {
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc("user-999"))
                .thenReturn(List.of());

        List<Notification> result = notificationService.getNotificationsForUser("user-999");

        assertThat(result).isEmpty();
    }

    // ── getUnreadNotifications ─────────────────────────────────────────────

    @Test
    void getUnreadNotifications_returnsOnlyUnread() {
        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc("user-123"))
                .thenReturn(List.of(sampleNotif));

        List<Notification> result = notificationService.getUnreadNotifications("user-123");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isRead()).isFalse();
    }

    // ── getUnreadCount ─────────────────────────────────────────────────────

    @Test
    void getUnreadCount_returnsCorrectCount() {
        when(notificationRepository.countByUserIdAndReadFalse("user-123")).thenReturn(3L);

        long count = notificationService.getUnreadCount("user-123");

        assertThat(count).isEqualTo(3L);
    }

    // ── markAsRead ─────────────────────────────────────────────────────────

    @Test
    void markAsRead_success_setsReadTrue() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));
        when(notificationRepository.save(sampleNotif)).thenReturn(sampleNotif);

        Notification result = notificationService.markAsRead("notif-001", "user-123");

        assertThat(result.isRead()).isTrue();
        verify(notificationRepository).save(sampleNotif);
    }

    @Test
    void markAsRead_notFound_throws404() {
        when(notificationRepository.findById("wrong-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.markAsRead("wrong-id", "user-123"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Notification not found");
    }

    @Test
    void markAsRead_wrongUser_throws403() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));

        assertThatThrownBy(() -> notificationService.markAsRead("notif-001", "other-user"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    // ── markAllAsRead ──────────────────────────────────────────────────────

    @Test
    void markAllAsRead_savesAllAsRead() {
        Notification n2 = new Notification();
        n2.setId("notif-002");
        n2.setUserId("user-123");
        n2.setRead(false);

        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc("user-123"))
                .thenReturn(List.of(sampleNotif, n2));

        notificationService.markAllAsRead("user-123");

        assertThat(sampleNotif.isRead()).isTrue();
        assertThat(n2.isRead()).isTrue();
        verify(notificationRepository).saveAll(anyList());
    }

    @Test
    void markAllAsRead_noUnread_savesEmptyList() {
        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc("user-123"))
                .thenReturn(List.of());

        notificationService.markAllAsRead("user-123");

        verify(notificationRepository).saveAll(List.of());
    }

    // ── deleteNotification ─────────────────────────────────────────────────

    @Test
    void deleteNotification_success_deletesNotif() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));

        notificationService.deleteNotification("notif-001", "user-123");

        verify(notificationRepository).delete(sampleNotif);
    }

    @Test
    void deleteNotification_notFound_throws404() {
        when(notificationRepository.findById("wrong-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.deleteNotification("wrong-id", "user-123"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Notification not found");
    }

    @Test
    void deleteNotification_wrongUser_throws403() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));

        assertThatThrownBy(() -> notificationService.deleteNotification("notif-001", "other-user"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    // ── createSelfNotification ─────────────────────────────────────────────

    @Test
    void createSelfNotification_success_createsGeneralNotif() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(sampleNotif);

        Notification result = notificationService.createSelfNotification(
                "user-123", "Hello", "World");

        assertThat(result).isNotNull();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void createSelfNotification_nullTitle_usesDefaultTitle() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> {
            Notification n = inv.getArgument(0);
            assertThat(n.getTitle()).isEqualTo("General Update");
            return n;
        });

        notificationService.createSelfNotification("user-123", null, "Some message");
    }

    @Test
    void createSelfNotification_blankTitle_usesDefaultTitle() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> {
            Notification n = inv.getArgument(0);
            assertThat(n.getTitle()).isEqualTo("General Update");
            return n;
        });

        notificationService.createSelfNotification("user-123", "   ", "Some message");
    }

    // ── updateNotification ─────────────────────────────────────────────────

    @Test
    void updateNotification_success_updatesFields() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));
        when(notificationRepository.save(sampleNotif)).thenReturn(sampleNotif);

        Notification result = notificationService.updateNotification(
                "notif-001", "user-123", "New Title", "New Message", true);

        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getMessage()).isEqualTo("New Message");
        assertThat(result.isRead()).isTrue();
    }

    @Test
    void updateNotification_nullFields_keepsExistingValues() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));
        when(notificationRepository.save(sampleNotif)).thenReturn(sampleNotif);

        Notification result = notificationService.updateNotification(
                "notif-001", "user-123", null, null, null);

        assertThat(result.getTitle()).isEqualTo("Booking Approved");
        assertThat(result.getMessage()).isEqualTo("Your booking has been approved.");
        assertThat(result.isRead()).isFalse();
    }

    @Test
    void updateNotification_wrongUser_throws403() {
        when(notificationRepository.findById("notif-001")).thenReturn(Optional.of(sampleNotif));

        assertThatThrownBy(() -> notificationService.updateNotification(
                "notif-001", "other-user", "Title", "Msg", true))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    // ── notifyBookingEvent ─────────────────────────────────────────────────

    @Test
    void notifyBookingEvent_approved_createsCorrectNotif() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));


        BookingNotificationEvent event = new BookingNotificationEvent(
                "BOOKING_APPROVED",   // action
                "booking-001",        // bookingId
                "resource-001",       // resourceId
                "user-123",           // ownerUserId
                null,                 // status
                "admin-1",            // triggeredBy
                null,                 // reason
                java.time.Instant.now() // occurredAt
        );

        Notification result = notificationService.notifyBookingEvent(event);

        assertThat(result.getTitle()).isEqualTo("Booking Approved");
        assertThat(result.getRelatedEntityId()).isEqualTo("booking-001");
    }

    @Test
    void notifyBookingEvent_rejected_includesReason() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));


        BookingNotificationEvent event = new BookingNotificationEvent(
                "BOOKING_REJECTED",
                "booking-001",
                "resource-001",
                "user-123",
                null,
                "admin-1",
                "Overlapping booking",
                java.time.Instant.now()
        );

        Notification result = notificationService.notifyBookingEvent(event);

        assertThat(result.getTitle()).isEqualTo("Booking Rejected");
        assertThat(result.getMessage()).contains("Overlapping booking");
        assertThat(result.getType()).isEqualTo(Notification.NotificationType.BOOKING_REJECTED);
    }

    @Test
    void notifyBookingEvent_cancelled_createsCorrectNotif() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingNotificationEvent event = new BookingNotificationEvent(
                "BOOKING_CANCELLED",
                "booking-001",
                "resource-001",
                "user-123",
                null,
                "user-123",
                null,
                java.time.Instant.now()
        );

        Notification result = notificationService.notifyBookingEvent(event);

        assertThat(result.getTitle()).isEqualTo("Booking Cancelled");
        assertThat(result.getType()).isEqualTo(Notification.NotificationType.BOOKING_CANCELLED);
    }

    @Test
    void notifyBookingEvent_unknownAction_usesGeneralType() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingNotificationEvent event = new BookingNotificationEvent(
                "UNKNOWN_ACTION",
                "booking-001",
                "resource-001",
                "user-123",
                null,
                "system",
                null,
                java.time.Instant.now()
        );

        Notification result = notificationService.notifyBookingEvent(event);

        assertThat(result.getTitle()).isEqualTo("Booking Update");
        assertThat(result.getType()).isEqualTo(Notification.NotificationType.GENERAL);
    }
}