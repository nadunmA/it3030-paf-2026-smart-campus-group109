package com.wegroup423.smart_campus.features.notification.model;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Notification Model Tests")
class NotificationTest {

    // Builder / Default values

    @Nested
    @DisplayName("Builder & Default Values")
    class BuilderDefaults {

        @Test
        @DisplayName("read defaults to false when not set")
        void readDefaultsFalse() {
            Notification notification = Notification.builder()
                    .userId("user-001")
                    .title("Booking Approved")
                    .message("Your booking has been approved.")
                    .type(Notification.NotificationType.BOOKING_APPROVED)
                    .build();

            assertThat(notification.isRead()).isFalse();
        }

        @Test
        @DisplayName("createdAt is auto-populated when not set")
        void createdAtAutoPopulated() {
            LocalDateTime before = LocalDateTime.now().minusSeconds(1);

            Notification notification = Notification.builder()
                    .userId("user-001")
                    .title("Test")
                    .message("Test message")
                    .type(Notification.NotificationType.GENERAL)
                    .build();

            LocalDateTime after = LocalDateTime.now().plusSeconds(1);

            assertThat(notification.getCreatedAt())
                    .isAfter(before)
                    .isBefore(after);
        }

        @Test
        @DisplayName("Full builder sets all fields correctly")
        void fullBuilderSetsAllFields() {
            LocalDateTime now = LocalDateTime.now();

            Notification notification = Notification.builder()
                    .id("notif-001")
                    .userId("user-001")
                    .title("Ticket Status Changed")
                    .message("Your ticket is now IN_PROGRESS.")
                    .type(Notification.NotificationType.TICKET_STATUS_CHANGED)
                    .read(true)
                    .createdAt(now)
                    .relatedEntityId("ticket-999")
                    .relatedEntityType("TICKET")
                    .build();

            assertThat(notification.getId()).isEqualTo("notif-001");
            assertThat(notification.getUserId()).isEqualTo("user-001");
            assertThat(notification.getTitle()).isEqualTo("Ticket Status Changed");
            assertThat(notification.getMessage()).isEqualTo("Your ticket is now IN_PROGRESS.");
            assertThat(notification.getType()).isEqualTo(Notification.NotificationType.TICKET_STATUS_CHANGED);
            assertThat(notification.isRead()).isTrue();
            assertThat(notification.getCreatedAt()).isEqualTo(now);
            assertThat(notification.getRelatedEntityId()).isEqualTo("ticket-999");
            assertThat(notification.getRelatedEntityType()).isEqualTo("TICKET");
        }
    }

    //  NoArgsConstructor

    @Nested
    @DisplayName("NoArgsConstructor & Setters")
    class NoArgsConstructorTests {

        @Test
        @DisplayName("NoArgsConstructor creates object without exceptions")
        void noArgsConstructorWorks() {
            Notification notification = new Notification();
            assertThat(notification).isNotNull();
        }

        @Test
        @DisplayName("Setters update fields correctly")
        void settersWork() {
            Notification notification = new Notification();
            notification.setId("notif-002");
            notification.setUserId("user-002");
            notification.setTitle("New Comment");
            notification.setMessage("Someone commented on your ticket.");
            notification.setType(Notification.NotificationType.NEW_COMMENT);
            notification.setRead(false);
            notification.setRelatedEntityId("ticket-123");
            notification.setRelatedEntityType("COMMENT");

            assertThat(notification.getId()).isEqualTo("notif-002");
            assertThat(notification.getType()).isEqualTo(Notification.NotificationType.NEW_COMMENT);
            assertThat(notification.getRelatedEntityType()).isEqualTo("COMMENT");
        }
    }

    // AllArgsConstructor
    @Nested
    @DisplayName("AllArgsConstructor")
    class AllArgsConstructorTests {

        @Test
        @DisplayName("AllArgsConstructor sets all fields")
        void allArgsConstructorSetsFields() {
            LocalDateTime now = LocalDateTime.now();

            Notification notification = new Notification(
                    "notif-003",
                    "user-003",
                    "Booking Rejected",
                    "Your booking was rejected.",
                    Notification.NotificationType.BOOKING_REJECTED,
                    false,
                    now,
                    "booking-456",
                    "BOOKING"
            );

            assertThat(notification.getId()).isEqualTo("notif-003");
            assertThat(notification.getUserId()).isEqualTo("user-003");
            assertThat(notification.getType()).isEqualTo(Notification.NotificationType.BOOKING_REJECTED);
            assertThat(notification.getRelatedEntityId()).isEqualTo("booking-456");
            assertThat(notification.getCreatedAt()).isEqualTo(now);
        }
    }

    // NotificationType enum
    @Nested
    @DisplayName("NotificationType Enum")
    class NotificationTypeTests {

        @Test
        @DisplayName("All expected enum values exist")
        void allEnumValuesExist() {
            Notification.NotificationType[] types = Notification.NotificationType.values();

            assertThat(types).containsExactlyInAnyOrder(
                    Notification.NotificationType.BOOKING_APPROVED,
                    Notification.NotificationType.BOOKING_REJECTED,
                    Notification.NotificationType.BOOKING_CANCELLED,
                    Notification.NotificationType.TICKET_STATUS_CHANGED,
                    Notification.NotificationType.TICKET_ASSIGNED,
                    Notification.NotificationType.NEW_COMMENT,
                    Notification.NotificationType.GENERAL
            );
        }

        @Test
        @DisplayName("valueOf returns correct enum constant")
        void valueOfWorks() {
            assertThat(Notification.NotificationType.valueOf("BOOKING_APPROVED"))
                    .isEqualTo(Notification.NotificationType.BOOKING_APPROVED);

            assertThat(Notification.NotificationType.valueOf("NEW_COMMENT"))
                    .isEqualTo(Notification.NotificationType.NEW_COMMENT);
        }

        @Test
        @DisplayName("Invalid enum value throws IllegalArgumentException")
        void invalidEnumValueThrows() {
            org.junit.jupiter.api.Assertions.assertThrows(
                    IllegalArgumentException.class,
                    () -> Notification.NotificationType.valueOf("INVALID_TYPE")
            );
        }
    }

    //  Equality & HashCode
    @Nested
    @DisplayName("Equals & HashCode")
    class EqualsHashCodeTests {

        @Test
        @DisplayName("Two notifications with same fields are equal")
        void equalNotifications() {
            LocalDateTime now = LocalDateTime.of(2026, 4, 16, 10, 0, 0);

            Notification n1 = Notification.builder()
                    .id("notif-same")
                    .userId("user-001")
                    .title("Test")
                    .message("Message")
                    .type(Notification.NotificationType.GENERAL)
                    .read(false)
                    .createdAt(now)
                    .build();

            Notification n2 = Notification.builder()
                    .id("notif-same")
                    .userId("user-001")
                    .title("Test")
                    .message("Message")
                    .type(Notification.NotificationType.GENERAL)
                    .read(false)
                    .createdAt(now)
                    .build();

            assertThat(n1).isEqualTo(n2);
            assertThat(n1.hashCode()).isEqualTo(n2.hashCode());
        }

        @Test
        @DisplayName("Notifications with different IDs are not equal")
        void differentIdNotEqual() {
            LocalDateTime now = LocalDateTime.now();

            Notification n1 = Notification.builder().id("notif-A").userId("user-001")
                    .title("T").message("M").type(Notification.NotificationType.GENERAL)
                    .createdAt(now).build();

            Notification n2 = Notification.builder().id("notif-B").userId("user-001")
                    .title("T").message("M").type(Notification.NotificationType.GENERAL)
                    .createdAt(now).build();

            assertThat(n1).isNotEqualTo(n2);
        }
    }

    // Mark as read mutation
    @Nested
    @DisplayName("Read State Mutation")
    class ReadStateMutationTests {

        @Test
        @DisplayName("Notification can be marked as read")
        void canMarkAsRead() {
            Notification notification = Notification.builder()
                    .userId("user-001")
                    .title("Test")
                    .message("Test")
                    .type(Notification.NotificationType.GENERAL)
                    .build();

            assertThat(notification.isRead()).isFalse();

            notification.setRead(true);

            assertThat(notification.isRead()).isTrue();
        }
    }
}
