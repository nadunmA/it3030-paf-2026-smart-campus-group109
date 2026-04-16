package com.wegroup423.smart_campus.features.booking.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.booking.exception.BookingConflictException;
import com.wegroup423.smart_campus.features.booking.exception.CapacityExceededException;
import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.model.enums.ResourceType;
import com.wegroup423.smart_campus.features.booking.repository.BookingRepository;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private ResourceCapacityProvider resourceCapacityProvider;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private CreateBookingRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateBookingRequest(
                "R-100",
                ResourceType.LECTURE_HALL,
                LocalDate.now().plusDays(1),
                LocalTime.of(9, 0),
                LocalTime.of(11, 0),
                "PAF Lecture",
                50
        );
    }

    @Test
    void createBooking_throwsWhenResourceMissing() {
        when(resourceRepository.findById("R-100")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.createBooking(request, "user-1")
        );

        assertEquals("Resource not found: R-100", ex.getMessage());
    }

    @Test
    void createBooking_throwsWhenResourceUnavailable() {
        Resource resource = Resource.builder()
                .id("R-100")
                .capacity(100)
                .availability(ResourceAvailability.MAINTENANCE)
                .build();
        when(resourceRepository.findById("R-100")).thenReturn(Optional.of(resource));

        assertThrows(BookingConflictException.class, () -> bookingService.createBooking(request, "user-1"));
    }

    @Test
    void createBooking_throwsWhenCapacityExceeded() {
        Resource resource = Resource.builder()
                .id("R-100")
                .capacity(40)
                .availability(ResourceAvailability.AVAILABLE)
                .build();

        when(resourceRepository.findById("R-100")).thenReturn(Optional.of(resource));
        when(resourceCapacityProvider.getCapacityForResource("R-100")).thenReturn(40);

        assertThrows(CapacityExceededException.class, () -> bookingService.createBooking(request, "user-1"));
    }

    @Test
    void createBooking_throwsWhenOverlappingBookingExists() {
        Resource resource = Resource.builder()
                .id("R-100")
                .capacity(100)
                .availability(ResourceAvailability.AVAILABLE)
                .build();

        Booking existing = Booking.builder()
                .id("B-existing")
                .resourceId("R-100")
                .bookingDate(request.bookingDate())
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .status(BookingStatus.APPROVED)
                .build();

        when(resourceRepository.findById("R-100")).thenReturn(Optional.of(resource));
        when(resourceCapacityProvider.getCapacityForResource("R-100")).thenReturn(100);
        when(bookingRepository.findOverlappingBookings(
                eq("R-100"),
                eq(request.bookingDate()),
                eq(request.startTime()),
                eq(request.endTime()),
                any()))
                .thenReturn(List.of(existing));

        assertThrows(BookingConflictException.class, () -> bookingService.createBooking(request, "user-1"));
    }

    @Test
    void createBooking_savesWhenValid() {
        Resource resource = Resource.builder()
                .id("R-100")
                .capacity(100)
                .availability(ResourceAvailability.AVAILABLE)
                .build();

        Booking saved = Booking.builder()
                .id("B-1")
                .resourceId(request.resourceId())
                .resourceType(request.resourceType())
                .userId("user-1")
                .bookingDate(request.bookingDate())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .purpose(request.purpose())
                .expectedAttendees(request.expectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(resourceRepository.findById("R-100")).thenReturn(Optional.of(resource));
        when(resourceCapacityProvider.getCapacityForResource("R-100")).thenReturn(100);
        when(bookingRepository.findOverlappingBookings(
                eq("R-100"),
                eq(request.bookingDate()),
                eq(request.startTime()),
                eq(request.endTime()),
                any()))
                .thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenReturn(saved);

        BookingResponse response = bookingService.createBooking(request, "user-1");

        assertEquals("B-1", response.id());
        assertEquals("R-100", response.resourceId());
        assertEquals(BookingStatus.PENDING, response.status());
        verify(notificationService).notifyBookingEvent(any());
    }
}
