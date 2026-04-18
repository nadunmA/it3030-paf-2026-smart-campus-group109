package com.wegroup423.smart_campus.features.notification.repository;

import com.wegroup423.smart_campus.features.notification.model.Notification;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    private final String TEST_USER = "user-789";

    @BeforeEach
    void setUp() {

        Notification oldNotif = Notification.builder()
                .userId(TEST_USER)
                .title("Old Notification")
                .read(true)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();

        Notification newNotif = Notification.builder()
                .userId(TEST_USER)
                .title("New Notification")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.saveAll(List.of(oldNotif, newNotif));
    }

    @AfterEach
    void tearDown() {
        notificationRepository.deleteAll();
    }

    @Test
    void findByUserIdOrderByCreatedAtDesc_ShouldReturnSortedList() {
        List<Notification> results = notificationRepository.findByUserIdOrderByCreatedAtDesc(TEST_USER);

        assertThat(results).hasSize(2);

        assertThat(results.get(0).getTitle()).isEqualTo("New Notification");
    }

    @Test
    void findByUserIdAndReadFalseOrderByCreatedAtDesc_ShouldReturnOnlyUnread() {
        List<Notification> unreadResults = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(TEST_USER);

        assertThat(unreadResults).hasSize(1);
        assertThat(unreadResults.get(0).isRead()).isFalse();
        assertThat(unreadResults.get(0).getTitle()).isEqualTo("New Notification");
    }

    @Test
    void countByUserIdAndReadFalse_ShouldReturnCorrectCount() {
        long unreadCount = notificationRepository.countByUserIdAndReadFalse(TEST_USER);

        assertThat(unreadCount).isEqualTo(1);
    }

    @Test
    void deleteByUserId_ShouldRemoveAllUserNotifications() {
        notificationRepository.deleteByUserId(TEST_USER);

        long countAfterDelete = notificationRepository.countByUserIdAndReadFalse(TEST_USER);
        List<Notification> listAfterDelete = notificationRepository.findByUserIdOrderByCreatedAtDesc(TEST_USER);

        assertThat(countAfterDelete).isZero();
        assertThat(listAfterDelete).isEmpty();
    }
}
