package com.wegroup423.smart_campus.features.booking.service.impl;

import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.booking.exception.BookingConflictException;
import com.wegroup423.smart_campus.features.booking.exception.CapacityExceededException;
import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.repository.BookingRepository;
import com.wegroup423.smart_campus.features.booking.service.BookingService;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceCapacityProvider resourceCapacityProvider;
    private final NotificationService notificationService;

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, String userId) {
        Resource resource = resourceRepository.findById(request.resourceId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + request.resourceId()));

        if (resource.getAvailability() != ResourceAvailability.AVAILABLE) {
            throw new BookingConflictException("Resource is not available for booking");
        }

        int capacity = resourceCapacityProvider.getCapacityForResource(request.resourceId());
        if (request.expectedAttendees() > capacity) {
            throw new CapacityExceededException(
                    "Expected attendees (" + request.expectedAttendees() + ") exceeds capacity (" + capacity + ")");
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.resourceId(),
                request.bookingDate(),
                request.startTime(),
                request.endTime(),
                List.of(BookingStatus.APPROVED, BookingStatus.PENDING)
        );

        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("There is an overlapping booking for this resource");
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .resourceId(request.resourceId())
                .resourceType(request.resourceType())
                .bookingDate(request.bookingDate())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .purpose(request.purpose())
                .expectedAttendees(request.expectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        notificationService.notifyBookingEvent(new BookingNotificationEvent(
                "BOOKING_CREATED", saved.getId(), saved.getResourceId(),
                userId, saved.getStatus().name(), "SYSTEM", null, Instant.now()
        ));

        log.info("Booking created: {} for user: {}", saved.getId(), userId);
        return BookingResponse.from(saved);
    }

    @Override
    public List<BookingResponse> getAllBookings(LocalDate date, BookingStatus status) {
        List<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findByStatus(status);
        } else {
            bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        }

        if (date != null) {
            bookings = bookings.stream()
                    .filter(b -> date.equals(b.getBookingDate()))
                    .toList();
        }

        return bookings.stream().map(BookingResponse::from).toList();
    }

    @Override
    public List<BookingResponse> getBookingsForUser(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::from)
                .toList();
    }

    @Override
    public BookingResponse getBookingById(String id) {
        return bookingRepository.findById(id)
                .map(BookingResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
    }

    @Override
    public BookingResponse approveBooking(String id, String adminId, String reason) {
        Booking booking = findBookingOrThrow(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedBy(adminId);
        booking.setUpdatedAt(Instant.now());
        Booking saved = bookingRepository.save(booking);

        notificationService.notifyBookingEvent(new BookingNotificationEvent(
                "BOOKING_APPROVED", saved.getId(), saved.getResourceId(),
                saved.getUserId(), saved.getStatus().name(), adminId, reason, Instant.now()
        ));

        return BookingResponse.from(saved);
    }

    @Override
    public BookingResponse rejectBooking(String id, String adminId, String reason) {
        Booking booking = findBookingOrThrow(id);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setUpdatedAt(Instant.now());
        Booking saved = bookingRepository.save(booking);

        notificationService.notifyBookingEvent(new BookingNotificationEvent(
                "BOOKING_REJECTED", saved.getId(), saved.getResourceId(),
                saved.getUserId(), saved.getStatus().name(), adminId, reason, Instant.now()
        ));

        return BookingResponse.from(saved);
    }

    @Override
    public BookingResponse cancelBooking(String id, String userId) {
        Booking booking = findBookingOrThrow(id);

        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(Instant.now());
        Booking saved = bookingRepository.save(booking);

        notificationService.notifyBookingEvent(new BookingNotificationEvent(
                "BOOKING_CANCELLED", saved.getId(), saved.getResourceId(),
                saved.getUserId(), saved.getStatus().name(), userId, null, Instant.now()
        ));

        return BookingResponse.from(saved);
    }

    private Booking findBookingOrThrow(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
    }
}
