package com.wegroup423.smart_campus.features.notification.controller;


import com.wegroup423.smart_campus.features.notification.model.Notification;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @MockitoBean
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
    }

    // GET /api/notifications/my

    @Test
    @WithMockUser(username = "user-123")
    void getMyNotifications_returnsListAndUnreadCount() throws Exception {
        when(notificationService.getNotificationsForUser("user-123"))
                .thenReturn(List.of(sampleNotif));
        when(notificationService.getUnreadCount("user-123")).thenReturn(1L);

        mockMvc.perform(get("/api/notifications/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notifications").isArray())
                .andExpect(jsonPath("$.notifications[0].id").value("notif-001"))
                .andExpect(jsonPath("$.unreadCount").value(1))
                .andExpect(jsonPath("$.total").value(1));
    }

    @Test
    @WithMockUser(username = "user-123")
    void getMyNotifications_unreadOnly_returnsOnlyUnread() throws Exception {
        when(notificationService.getUnreadNotifications("user-123"))
                .thenReturn(List.of(sampleNotif));
        when(notificationService.getUnreadCount("user-123")).thenReturn(1L);

        mockMvc.perform(get("/api/notifications/my").param("unreadOnly", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notifications").isArray())
                .andExpect(jsonPath("$.unreadCount").value(1));
    }

    @Test
    void getMyNotifications_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/notifications/my"))
                .andExpect(status().isUnauthorized());
    }

    // POST /api/notifications/my

    @Test
    @WithMockUser(username = "user-123")
    void createMyNotification_returnsCreated() throws Exception {
        when(notificationService.createSelfNotification(
                eq("user-123"), eq("Test Title"), eq("Test Message")))
                .thenReturn(sampleNotif);

        String body = """
                {"title": "Test Title", "message": "Test Message"}
                """;

        mockMvc.perform(post("/api/notifications/my")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("notif-001"));
    }

    // PATCH /api/notifications/{id}/read

    @Test
    @WithMockUser(username = "user-123")
    void markAsRead_returnsUpdatedNotification() throws Exception {
        Notification readNotif = new Notification();
        readNotif.setId("notif-001");
        readNotif.setRead(true);

        when(notificationService.markAsRead("notif-001", "user-123"))
                .thenReturn(readNotif);

        mockMvc.perform(patch("/api/notifications/notif-001/read")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("notif-001"))
                .andExpect(jsonPath("$.read").value(true));
    }

    @Test
    void markAsRead_unauthenticated_returns401() throws Exception {
        mockMvc.perform(patch("/api/notifications/notif-001/read").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    // PATCH /api/notifications/my/read-all

    @Test
    @WithMockUser(username = "user-123")
    void markAllAsRead_returnsSuccessMessage() throws Exception {
        doNothing().when(notificationService).markAllAsRead("user-123");

        mockMvc.perform(patch("/api/notifications/my/read-all").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("All notifications marked as read"));

        verify(notificationService, times(1)).markAllAsRead("user-123");
    }

    // DELETE /api/notifications/{id}

    @Test
    @WithMockUser(username = "user-123")
    void deleteNotification_returnsSuccessMessage() throws Exception {
        doNothing().when(notificationService).deleteNotification("notif-001", "user-123");

        mockMvc.perform(delete("/api/notifications/notif-001")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Notification deleted"));

        verify(notificationService, times(1)).deleteNotification("notif-001", "user-123");
    }

    // GET /api/notifications/stats/my

    @Test
    @WithMockUser(username = "user-123")
    void getMyNotificationStats_returnsStats() throws Exception {
        when(notificationService.getNotificationsForUser("user-123"))
                .thenReturn(List.of(sampleNotif));
        when(notificationService.getUnreadCount("user-123")).thenReturn(1L);

        mockMvc.perform(get("/api/notifications/stats/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("user-123"))
                .andExpect(jsonPath("$.unreadCount").value(1))
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.readCount").value(0));
    }

    // PUT /api/notifications/{id}

    @Test
    @WithMockUser(username = "user-123")
    void updateNotification_returnsUpdated() throws Exception {
        Notification updated = new Notification();
        updated.setId("notif-001");
        updated.setTitle("Updated Title");
        updated.setMessage("Updated Message");
        updated.setRead(true);

        when(notificationService.updateNotification(
                eq("notif-001"), eq("user-123"),
                eq("Updated Title"), eq("Updated Message"), eq(true)))
                .thenReturn(updated);

        String body = """
                {"title": "Updated Title", "message": "Updated Message", "read": true}
                """;

        mockMvc.perform(put("/api/notifications/notif-001")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.read").value(true));
    }
}
